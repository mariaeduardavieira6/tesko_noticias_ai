import os
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import Base, engine
from .routers import articles, categories, companies
from .ws import manager  # <-- novo

# cria tabelas (caso não existam)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tesko Notícias AI API")

# CORS (para HTTP; WS não usa CORS, mas manter origens é bom p/ consistência)
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

# inclui rotas HTTP
app.include_router(articles.router)
app.include_router(categories.router)
app.include_router(companies.router)

# ---- mídia local (PDFs / áudios / imagens) ----
# estrutura esperada: backend/media/{pdfs,audios,images}
MEDIA_DIR = Path(__file__).resolve().parents[1] / "media"
MEDIA_DIR.mkdir(exist_ok=True)
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

# ------------------- WebSocket -------------------
@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Se quiser validar origem manualmente (opcional):
    # origin = websocket.headers.get("origin")
    # if origin not in origins:
    #     await websocket.close(code=1008)
    #     return

    await manager.connect(websocket)
    try:
        while True:
            # Se quiser tratar mensagens do cliente (ex.: "ping"), leia aqui
            _ = await websocket.receive_text()
            # opcional: await manager.send_personal_message({"type": "pong"}, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ------------- Rota DEV para emitir eventos -------------
dev_router = APIRouter(prefix="/api/dev", tags=["dev"])

@dev_router.post("/emit")
async def emit_dev_event(payload: dict):
    """
    Envia um broadcast para todos os clientes conectados ao WS.
    Exemplo de payload:
    {
      "type": "article_created",
      "article": {"id": 1, "title": "Novo post", "summary": "..."}
    }
    """
    await manager.broadcast(payload)
    return {"ok": True, "sent": payload}

app.include_router(dev_router)
