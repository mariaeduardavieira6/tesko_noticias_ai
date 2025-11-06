from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

try:
    # Pydantic v2
    from pydantic import ConfigDict
    V2 = True
except Exception:
    V2 = False


# -------------------------
# Helpers de compatibilidade
# -------------------------
def orm_cfg():
    if V2:
        return {"model_config": ConfigDict(from_attributes=True)}
    # fallback p/ Pydantic v1 (caso esteja usando v1)
    class _Cfg:
        orm_mode = True
    return {"Config": _Cfg}


# -------------------------
# Categorias & Empresas
# -------------------------
class CategoryOut(BaseModel):
    id: int
    name: str

    # orm_mode / from_attributes
    locals().update(orm_cfg())


class CompanyOut(BaseModel):
    id: int
    name: str

    locals().update(orm_cfg())


# -------------------------
# Artigos
# -------------------------
class ArticleOut(BaseModel):
    id: int
    title: str
    summary: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None
    pdf: Optional[str] = None
    audio: Optional[str] = None
    published_at: Optional[datetime] = None
    categories: List[CategoryOut] = Field(default_factory=list)
    companies: List[CompanyOut] = Field(default_factory=list)

    locals().update(orm_cfg())


class ArticleDetailOut(ArticleOut):
    content: Optional[str] = None

