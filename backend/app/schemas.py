from typing import List
from datetime import datetime
from pydantic import BaseModel

class CategoryOut(BaseModel):
    id: int
    name: str
    class Config: orm_mode = True

class CompanyOut(BaseModel):
    id: int
    name: str
    class Config: orm_mode = True

class ArticleOut(BaseModel):
    id: int
    title: str
    summary: str
    url: str
    image: str
    pdf: str
    audio: str
    published_at: datetime
    categories: List[CategoryOut] = []
    companies: List[CompanyOut] = []
    class Config: orm_mode = True
