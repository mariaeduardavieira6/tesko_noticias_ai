# backend/scripts/patch_media.py
import os
import sys
from sqlalchemy.orm import sessionmaker

# --- Bootstrap do sys.path para permitir "from backend.app ..." ---
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app.database import engine
from backend.app.models import Article

MEDIA = "http://127.0.0.1:8000/media"
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def run(article_id: int = 1):
    db = SessionLocal()
    try:
        # SQLAlchemy 2.0 way:
        article = db.get(Article, article_id)
        if not article:
            print(f"❌ Artigo {article_id} não encontrado.")
            return

        article.image = "https://placehold.co/800x480"
        article.pdf   = f"{MEDIA}/pdfs/exemplo.pdf"
        article.audio = f"{MEDIA}/audios/exemplo.mp3"  # troque para .m4a se for seu caso

        db.commit()
        print(f"✅ Artigo {article_id} atualizado com mídia.")
    except Exception as e:
        db.rollback()
        print(f"Erro: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run(1)  # mude o ID se quiser outro

