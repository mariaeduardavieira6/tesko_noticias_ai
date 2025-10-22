# 📰 Tesko Notícias AI

Dashboard de notícias sobre Inteligência Artificial, com front-end em **Next.js** e back-end em **FastAPI**, desenvolvido como parte do projeto integrado **Tesko Notícias AI**.

---

## 🚀 Tecnologias

### Front-end
- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query (TanStack)](https://tanstack.com/query/latest)
- [next-themes](https://github.com/pacocoursey/next-themes) (tema claro/escuro)
- [shadcn/ui](https://ui.shadcn.com) (componentes base)

### Back-end
- [FastAPI](https://fastapi.tiangolo.com)
- [PostgreSQL](https://www.postgresql.org)
- [SQLAlchemy ORM](https://www.sqlalchemy.org)
- Docker + Adminer

---

## 📁 Estrutura do Projeto

tesko_noticias_ai/
├── backend/
│ ├── app/
│ │ ├── routers/ # Endpoints (articles, categories, companies)
│ │ ├── models.py # Tabelas SQLAlchemy
│ │ ├── schemas.py # Schemas Pydantic
│ │ ├── database.py # Conexão com Postgres
│ │ └── main.py # App FastAPI principal
│ └── scripts/
│ └── seed.py # Popula o banco com 15 artigos
│
└── frontend/
├── src/
│ ├── app/ # Layout base e páginas Next.js
│ ├── components/ # Navbar, ArticleCard, etc.
│ ├── hooks/ # useArticles (busca/filtros)
│ └── lib/ # api.ts (requisições)
└── .env.local # NEXT_PUBLIC_API_BASE=http://localhost:8000


---

## 🧠 Funcionalidades — Semana 2

✅ Conexão completa com a API FastAPI  
✅ Consumo de dados reais (artigos, categorias, empresas)  
✅ Busca (`q`) funcional  
✅ Cards responsivos no estilo Pinterest  
✅ Paginação simples  
✅ Tema claro/escuro funcional  

---

## 💻 Como rodar o projeto localmente

### 1️⃣ Rodar o backend
```bash
cd backend
uvicorn app.main:app --reload

Acesse: http://localhost:8000/docs

### 2️⃣ Rodar o frontend
cd frontend
npm install
npm run dev

Acesse: http://localhost:3000