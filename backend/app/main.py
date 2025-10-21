import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routers import articles, categories, companies

# cria tabelas (caso não existam)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tesko Notícias AI API")

# CORS
origins = [os.getenv("ALLOW_ORIGINS", "http://localhost:3000")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

# inclui rotas
app.include_router(articles.router)
app.include_router(categories.router)
app.include_router(companies.router)
