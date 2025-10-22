from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base

# Tabelas de relação N:N
article_categories = Table(
    "article_categories",
    Base.metadata,
    Column("article_id", ForeignKey("articles.id"), primary_key=True),
    Column("category_id", ForeignKey("categories.id"), primary_key=True),
)

article_companies = Table(
    "article_companies",
    Base.metadata,
    Column("article_id", ForeignKey("articles.id"), primary_key=True),
    Column("company_id", ForeignKey("companies.id"), primary_key=True),
)

class Article(Base):
    __tablename__ = "articles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="")
    content: Mapped[str] = mapped_column(Text, default="")
    url: Mapped[str] = mapped_column(String(500), default="")
    image: Mapped[str] = mapped_column(String(500), default="")
    pdf: Mapped[str] = mapped_column(String(500), default="")
    audio: Mapped[str] = mapped_column(String(500), default="")
    published_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    categories = relationship("Category", secondary=article_categories, back_populates="articles")
    companies = relationship("Company", secondary=article_companies, back_populates="articles")

class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    articles = relationship("Article", secondary=article_categories, back_populates="categories")

class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    articles = relationship("Article", secondary=article_companies, back_populates="companies")
