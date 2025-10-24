from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_, func

from .. import models, schemas
from ..database import get_db
from ..redis_cache import get_json, set_json

router = APIRouter(prefix="/api/articles", tags=["Articles"])

# ----------------------------------------------------------------------
# /api/articles/latest
# ----------------------------------------------------------------------
@router.get("/latest", response_model=List[schemas.ArticleOut])
def latest_articles(
    limit: int = Query(5, ge=1, le=50, description="Quantidade de artigos mais recentes"),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Article)
        .options(
            selectinload(models.Article.categories),
            selectinload(models.Article.companies),
        )
        .order_by(models.Article.published_at.desc())
        .limit(limit)
        .all()
    )

# ----------------------------------------------------------------------
# /api/articles/{id} -> detalhe do artigo
# ----------------------------------------------------------------------
@router.get("/{article_id}", response_model=schemas.ArticleDetailOut)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
):
    article = (
        db.query(models.Article)
        .options(
            selectinload(models.Article.categories),
            selectinload(models.Article.companies),
        )
        .filter(models.Article.id == article_id)
        .first()
    )
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    return article

# ----------------------------------------------------------------------
# /api/articles -> busca, filtros e paginação (ÚNICA versão, com cache fail-open)
# ----------------------------------------------------------------------
@router.get("", response_model=List[schemas.ArticleOut])
async def list_articles(
    q: Optional[str] = Query(None, description="Busca em título, resumo e conteúdo"),
    category: Optional[List[str]] = Query(None, description="Categoria(s)"),
    company: Optional[List[str]] = Query(None, description="Empresa(s)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    response: Response = Response(),
    db: Session = Depends(get_db),
):
    # ----- CACHE KEY
    cache_key = f"articles:q={q}|cat={','.join(category) if category else ''}|comp={','.join(company) if company else ''}|l={limit}|o={offset}"

    # ----- tenta cache (fail-open)
    try:
        cached = await get_json(cache_key)
    except Exception:
        cached = None
    if cached:
        response.headers["X-Total-Count"] = str(cached.get("total", 0))
        return cached["items"]

    # ----- QUERY base (sem join manual)
    base = (
        db.query(models.Article)
        .options(
            selectinload(models.Article.categories),
            selectinload(models.Article.companies),
        )
    )

    if q:
        like = f"%{q}%"
        base = base.filter(
            or_(
                models.Article.title.ilike(like),
                models.Article.summary.ilike(like),
                models.Article.content.ilike(like),
            )
        )

    if category:
        # usa relação many-to-many: evita duplicações comuns de join
        base = base.filter(models.Article.categories.any(models.Category.name.in_(category)))

    if company:
        base = base.filter(models.Article.companies.any(models.Company.name.in_(company)))

    # ----- total seguro por subconsulta (distinct IDs)
    id_subq = base.with_entities(models.Article.id).distinct().subquery()
    total = db.query(func.count()).select_from(id_subq).scalar()
    response.headers["X-Total-Count"] = str(total)

    items = (
        base.order_by(models.Article.published_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    # ----- escreve no cache (fail-open)
    try:
        cache_items = [
            schemas.ArticleOut.model_validate(a, from_attributes=True).model_dump()
            for a in items
        ]
        await set_json(cache_key, {"items": cache_items, "total": total}, ttl=60)
    except Exception:
        pass

    return items
