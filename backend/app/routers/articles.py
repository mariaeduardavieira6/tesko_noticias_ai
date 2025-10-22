# backend/app/routers/articles.py
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import get_db
from sqlalchemy import or_

router = APIRouter(prefix="/api/articles", tags=["articles"])

# ----------------------------------------------------------------------
# NOVO ENDPOINT (Item 3 do seu checklist)
# ----------------------------------------------------------------------
@router.get("/latest", response_model=List[schemas.ArticleOut])
def latest_articles(limit: int = 5, db: Session = Depends(get_db)):
    """
    Retorna os N artigos mais recentes.
    """
    return (
        db.query(models.Article)
        .order_by(models.Article.published_at.desc())
        .limit(limit)
        .all()
    )

# ----------------------------------------------------------------------
# ENDPOINT PRINCIPAL (Com a correção)
# ----------------------------------------------------------------------
@router.get("", response_model=List[schemas.ArticleOut])
def list_articles(
    q: Optional[str] = Query(None, description="Busca em título, resumo e conteúdo"),
    category: Optional[str] = Query(None, description="Nome exato da categoria"),
    company: Optional[str] = Query(None, description="Nome exato da empresa"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """
    Lista todos os artigos com filtros e busca.
    """
    query = db.query(models.Article)

    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                models.Article.title.ilike(like),
                models.Article.summary.ilike(like),
                models.Article.content.ilike(like),
            )
        )

    if category:
        query = (
            query.join(models.Article.categories)
            .filter(models.Category.name == category)
        )

    if company:
        query = (
            query.join(models.Article.companies)
            .filter(models.Company.name == company)
        )

    # Ordenação padrão por mais recentes
    # (Veio antes do distinct para consistência)
    query = query.order_by(models.Article.published_at.desc())

    # --- A CORREÇÃO ESTÁ AQUI ---
    # Evita duplicatas quando há múltiplos joins N:N
    # Trocamos .distinct(models.Article.id) por .distinct()
    query = query.distinct()
    # --- FIM DA CORREÇÃO ---

    return query.offset(offset).limit(limit).all()