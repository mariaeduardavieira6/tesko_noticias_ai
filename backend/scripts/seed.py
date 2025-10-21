from app.db import SessionLocal, Base, engine
from app import models

def run():
    # garante tabelas
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # evita dados duplicados
        if not db.query(models.Category).first():
            cats = [models.Category(name=n) for n in ["Últimas notícias", "Pesquisas", "Lançamentos"]]
            comps = [models.Company(name=n) for n in ["OpenAI", "Google", "Meta"]]
            db.add_all(cats + comps)
            db.flush()

            art1 = models.Article(
                title="OpenAI lança novo modelo",
                summary="Resumo do lançamento do novo modelo.",
                url="https://exemplo.com/openai",
                image="https://picsum.photos/600/400?seed=1",
            )
            art1.categories.append(cats[0])
            art1.companies.append(comps[0])

            art2 = models.Article(
                title="Google anuncia melhorias no Gemini",
                summary="Atualizações de performance e segurança.",
                url="https://exemplo.com/google",
                image="https://picsum.photos/600/400?seed=2",
            )
            art2.categories.append(cats[2])
            art2.companies.append(comps[1])

            db.add_all([art1, art2])
            db.commit()
            print("✅ Seed inserido com sucesso.")
        else:
            print("ℹ️ Seed já existe. Nada a fazer.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
