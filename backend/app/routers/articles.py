from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response, HTTPException
from sqlalchemy.orm import Session, joinedload, load_only
from sqlalchemy import or_, func
from ..database import get_db
from .. import models, schemas

# AVISO: Removi a importação de 'redis_cache' e 'selectinload'
# pois não são usados na nova função list_articles e podem causar erros
# se os arquivos não existirem ou estiverem incompletos.
# A função 'get_article' foi mantida com joinedload (que é o que está sendo usado no novo código).

router = APIRouter(prefix="/api/articles", tags=["articles"])

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
            joinedload(models.Article.categories),
            joinedload(models.Article.companies),
        )
        .order_by(models.Article.published_at.desc())
        .limit(limit)
        .all()
    )

# ----------------------------------------------------------------------
# /api/articles/{id} -> detalhe do artigo (Conteúdo completo)
# ----------------------------------------------------------------------
@router.get("/{article_id}", response_model=schemas.ArticleDetailOut)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
):
    article = (
        db.query(models.Article)
        .options(
            joinedload(models.Article.categories),
            joinedload(models.Article.companies),
        )
        .filter(models.Article.id == article_id)
        .first()
    )
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    return article

# ----------------------------------------------------------------------
# /api/articles -> lista, filtros e paginação (Handler Otimizado)
# ----------------------------------------------------------------------
@router.get("", summary="Lista artigos com filtros e paginação")
def list_articles(
    response: Response,
    q: Optional[str] = None,
    # IDs de categoria (usamos int para melhor performance no join)
    category: Optional[List[int]] = Query(None, description="IDs de categoria (repetir o param para múltiplos)"),
    # IDs de empresa (usamos int para melhor performance no join)
    company: Optional[List[int]] = Query(None, description="IDs de empresa (repetir o param para múltiplos)"),
    limit: int = Query(12, ge=1, le=60), # ⬇️ limit padrão 12
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """
    Retorna somente campos "leves" na listagem (sem 'content') para performance.
    """

    # Base query: evita carregar "content" e faz eager-load só do necessário
    query = (
        db.query(models.Article)
        .options(
            load_only(
                models.Article.id,
                models.Article.title,
                models.Article.summary,
                models.Article.url,
                models.Article.image,
                # Tenta carregar image_url se existir no modelo
                getattr(models.Article, "image_url", models.Article.image),
                models.Article.published_at,
            ),
            joinedload(models.Article.categories).load_only(models.Category.id, models.Category.name),
            joinedload(models.Article.companies).load_only(models.Company.id, models.Company.name),
        )
        .order_by(models.Article.published_at.desc(), models.Article.id.desc())
    )

    # Filtro de busca (q)
    if q:
        like = f"%{q}%"
        query = query.filter(
            (models.Article.title.ilike(like))
            | (models.Article.summary.ilike(like))
            | (models.Article.content.ilike(like))
        )

    # Filtro por categorias (IDs)
    if category:
        query = query.join(models.Article.categories).filter(models.Category.id.in_(category))
        # Adiciona distinct para evitar duplicar contagens em joins many-to-many
        query = query.distinct()

    # Filtro por empresas (IDs)
    if company:
        query = query.join(models.Article.companies).filter(models.Company.id.in_(company))
        # Adiciona distinct para evitar duplicar contagens em joins many-to-many
        query = query.distinct()

    # Contagem total
    total = query.count()

    # Aplica paginação
    rows = query.offset(offset).limit(limit).all()

    # Serialização leve (manual, para garantir a estrutura ArticleOut)
    items = []
    for a in rows:
        items.append(
            {
                "id": a.id,
                "title": a.title,
                "summary": a.summary,
                "url": a.url,
                "image": getattr(a, "image", None),
                "image_url": getattr(a, "image_url", None),
                "published_at": a.published_at.isoformat() if getattr(a, "published_at", None) else None,
                "categories": [{"id": c.id, "name": c.name} for c in getattr(a, "categories", [])],
                "companies": [{"id": p.id, "name": p.name} for p in getattr(a, "companies", [])],
            }
        )

    # Header para a paginação no front
    response.headers["x-total-count"] = str(total)
    return items
