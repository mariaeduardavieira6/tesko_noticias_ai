# backend/app/routers/articles.py
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_

from app import models, schemas
from app.database import get_db

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
# /api/articles  -> busca, filtros e paginação
# ----------------------------------------------------------------------
@router.get("", response_model=List[schemas.ArticleOut])
def list_articles(
    q: Optional[str] = Query(None, description="Busca em título, resumo e conteúdo"),
    category: Optional[List[str]] = Query(None, description="Categoria(s)"),
    company: Optional[List[str]] = Query(None, description="Empresa(s)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    response: Response = None,
    db: Session = Depends(get_db),
):
    query = (
        db.query(models.Article)
        .options(
            selectinload(models.Article.categories),
            selectinload(models.Article.companies),
        )
    )

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
            .filter(models.Category.name.in_(category))
        )

    if company:
        query = (
            query.join(models.Article.companies)
            .filter(models.Company.name.in_(company))
        )

    total = query.distinct().count()
    if response is not None:
        response.headers["X-Total-Count"] = str(total)

    return (
        query.order_by(models.Article.published_at.desc())
        .distinct()
        .offset(offset)
        .limit(limit)
        .all()
    )
