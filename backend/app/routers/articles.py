from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/articles", tags=["Articles"])

@router.get("", response_model=List[schemas.ArticleOut])
def list_articles(
    q: Optional[str] = None,
    category: Optional[str] = None,
    company: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(models.Article)
    if q:
        query = query.filter(models.Article.title.ilike(f"%{q}%"))
    if category:
        query = query.join(models.Article.categories).filter(models.Category.name == category)
    if company:
        query = query.join(models.Article.companies).filter(models.Company.name == company)
    return query.order_by(models.Article.published_at.desc()).limit(limit).all()

@router.get("/{article_id}", response_model=schemas.ArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(models.Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
