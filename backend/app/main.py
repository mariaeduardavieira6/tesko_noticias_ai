import os
import json
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from . import models  # 👈 garante que as tabelas sejam registradas
from .routers import articles, categories, companies
from .ws import manager  # precisa ter connect/ disconnect/ broadcast

# cria tabelas (caso não existam)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tesko Notícias AI API")

# ---------- CORS ----------
origins_env = os.getenv("ALLOW_ORIGINS", "")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]
# locais padrão
origins += ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # 👈 previews e prod no Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"ok": True}  # 👈 boolean real

# ---------- Rotas HTTP ----------
app.include_router(articles.router)
app.include_router(categories.router)
app.include_router(companies.router)

# ---------- Mídia estática ----------
MEDIA_DIR = Path(__file__).resolve().parents[1] / "media"
for sub in ("pdfs", "audios", "images"):
    (MEDIA_DIR / sub).mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

# ---------- WebSocket ----------
@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Se quiser validar manualmente:
    # origin = websocket.headers.get("origin")
    # if origin not in origins and not re.match(r"https://.*\.vercel\.app", origin or ""):
    #     await websocket.close(code=1008); return

    # Se o seu manager NÃO dá accept internamente, descomente:
    # await websocket.accept()

    await manager.connect(websocket)
    try:
        while True:
            # Caso queira ping/pong, leia aqui:
            _ = await websocket.receive_text()
            # opcional: await manager.send_personal_message({"type": "pong"}, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ---------- Rota DEV para emitir eventos ----------
dev_router = APIRouter(prefix="/api/dev", tags=["dev"])

@dev_router.post("/emit")
async def emit_dev_event(payload: dict):
    """
    Exemplo payload:
    {
      "type": "NEW_ARTICLES",
      "article": {"id": 1, "title": "Novo post", "summary": "..."}
    }
    """
    # Se o manager.broadcast espera string:
    # await manager.broadcast(json.dumps(payload))
    await manager.broadcast(payload)
    return {"ok": True, "sent": payload}

app.include_router(dev_router)

