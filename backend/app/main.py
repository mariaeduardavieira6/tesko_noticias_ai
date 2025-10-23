
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import Base, engine
from .routers import articles, categories, companies

# cria tabelas (caso não existam)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tesko Notícias AI API")

# CORS
# permite lista separada por vírgula no .env, ex: "http://localhost:3000,http://127.0.0.1:3000"
origins_env = os.getenv("ALLOW_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"ok": "true"}

# inclui rotas
app.include_router(articles.router)
app.include_router(categories.router)
app.include_router(companies.router)

# ---- mídia local (PDFs / áudios / imagens) ----
# estrutura esperada: backend/media/{pdfs,audios,images}
MEDIA_DIR = Path(__file__).resolve().parents[1] / "media"
MEDIA_DIR.mkdir(exist_ok=True)  # garante que exista
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")
