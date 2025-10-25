from backend.app.database import SessionLocal
from backend.app import models

ART_ID = 1
NEW_URL = "https://www.theverge.com/ai-artificial-intelligence"
NEW_IMG = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop"

db = SessionLocal()
art = db.query(models.Article).get(ART_ID)
if not art:
    raise SystemExit(f"Artigo {ART_ID} não encontrado")

art.url = NEW_URL
art.image = NEW_IMG        # ou art.image_url
db.add(art)
db.commit()
print(f"OK! Atualizado artigo {ART_ID}")
