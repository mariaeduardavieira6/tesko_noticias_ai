# backend/scripts/seed.py
import sys
import os
import requests  # 1. ADICIONADO: Para fazer requisições HTTP
from sqlalchemy import text
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import sessionmaker

# --- Bootstrap de path: adiciona a RAIZ do projeto ao sys.path ---
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

print("--- INICIANDO SEED ---")
print(f"Adicionando ao sys.path: {ROOT_DIR}")

# Imports do projeto
try:
    from backend.app.database import engine, Base
    from backend.app.models import Article, Category, Company
    # 2. REMOVIDO: Não importamos 'manager' nem 'asyncio'
except ImportError as e:
    print("\n--- ERRO DE IMPORTAÇÃO! ---")
    print("O Python não achou 'backend.app.database' ou 'backend.app.models'.")
    print(f"Erro original: {e}")
    print("\nCaminhos (sys.path) que o Python está procurando:")
    print('\n'.join(sys.path))
    sys.exit(1)

# Configuração da sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
MEDIA_BASE = os.getenv("MEDIA_BASE_URL", "http://127.0.0.1:8000/media")
PLACEHOLDER_IMG = "https://placehold.co/800x480"

def media_pdf(idx: int) -> str:
    return f"{MEDIA_BASE}/pdfs/exemplo.pdf"
def media_audio(idx: int) -> str:
    return f"{MEDIA_BASE}/audios/exemplo.mp3"

# 3. ALTERADO: De volta para 'def' síncrono
def seed_database():
    print("Garantindo que as tabelas existem...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Limpando tabelas existentes (se houver)...")
        db.execute(text("TRUNCATE TABLE articles, categories, companies RESTART IDENTITY CASCADE;"))
        db.commit()

        # --- Criação de Categorias ---
        cat_ia = Category(name="IA")
        cat_pesquisas = Category(name="Pesquisas")
        cat_lancamentos = Category(name="Lançamentos")
        cat_hardware = Category(name="Hardware")
        db.add_all([cat_ia, cat_pesquisas, cat_lancamentos, cat_hardware])
        db.commit()
        print("Categorias criadas.")

        # --- Criação de Empresas ---
        comp_google = Company(name="Google")
        comp_openai = Company(name="OpenAI")
        comp_meta = Company(name="Meta")
        comp_microsoft = Company(name="Microsoft") # Corrigido de 'namea='
        db.add_all([comp_google, comp_openai, comp_meta, comp_microsoft])
        db.commit()
        print("Empresas criadas.")

        # --- Criação de Artigos ---
        now = datetime.now(timezone.utc)
        artigos = []

        # 4. CORRIGIDO: Função 'artigo' (que já corrigimos antes)
        def artigo(idx, **kwargs):
            article_data = {
                "image": PLACEHOLDER_IMG,
                "pdf": media_pdf(idx),
                "audio": media_audio(idx),
            }
            article_data.update(kwargs)
            a = Article(**article_data)
            artigos.append(a)
            return a
            
        # 5. CORRIGIDO: CÓDIGO COMPLETO DOS 15 ARTIGOS (SEM '...')

        art1 = artigo(1,
            title="OpenAI lança GPT-5 com capacidades multimodais avançadas",
            summary="O novo modelo de IA GPT-5 surpreende o mercado.",
            content="O GPT-5 foi anunciado hoje pela OpenAI, prometendo revolucionar a interação humano-máquina com capacidades de áudio e vídeo em tempo real. A comunidade de tecnologia está em polvorosa.",
            published_at=now - timedelta(days=1),
            url="https://example.com/gpt-5-launch"
        )
        art1.categories += [cat_ia, cat_lancamentos]
        art1.companies.append(comp_openai)

        art2 = artigo(2,
            title="Google DeepMind publica pesquisa sobre otimização de algoritmos",
            summary="Nova pesquisa do DeepMind pode acelerar o treinamento de modelos.",
            content="Pesquisadores do Google DeepMind detalharam um novo método que reduz o tempo de treinamento de grandes modelos de linguagem em até 40%. O estudo foi publicado na revista Nature.",
            published_at=now - timedelta(days=3),
            url="https://example.com/google-research"
        )
        art2.categories += [cat_ia, cat_pesquisas]
        art2.companies.append(comp_google)

        art3 = artigo(3,
            title="Microsoft anuncia novo Surface Pro 10 com chip ARM",
            summary="A linha Surface adota arquitetura ARM para maior eficiência.",
            content="Em seu evento de hardware, a Microsoft revelou o Surface Pro 10. A grande novidade é a adoção de processadores baseados em ARM, prometendo bateria de longa duração e desempenho competitivo.",
            published_at=now - timedelta(days=2),
            url="https://example.com/surface-pro-10"
        )
        art3.categories += [cat_hardware, cat_lancamentos]
        art3.companies.append(comp_microsoft)

        art4 = artigo(4,
            title="Meta introduz 'Emu', seu novo gerador de vídeo por IA",
            summary="Emu gera clipes de vídeo curtos a partir de descrições de texto.",
            content="Seguindo a tendência de IA generativa, a Meta apresentou o Emu. O sistema foca em criar vídeos curtos e realistas, integrando-se futuramente ao Instagram e Facebook.",
            published_at=now - timedelta(days=5),
            url="https://example.com/meta-emu"
        )
        art4.categories.append(cat_ia)
        art4.companies.append(comp_meta)

        art5 = artigo(5,
            title="Android 15 é lançado oficialmente pelo Google",
            summary="A nova versão do sistema operacional foca em privacidade e IA.",
            content="O Google iniciou a distribuição do Android 15. Destaques incluem melhor integração com IA no nível do sistema e novos controles de privacidade para o usuário.",
            published_at=now - timedelta(days=4),
            url="https://example.com/android-15"
        )
        art5.categories.append(cat_lancamentos)
        art5.companies.append(comp_google)

        art6 = artigo(6,
            title="Estudo da OpenAI sobre segurança em IA Generativa",
            summary="A empresa detalha seus esforços para tornar a IA mais segura.",
            content="Em um whitepaper extenso, a OpenAI discutiu os riscos emergentes da IA generativa e as técnicas de 'red teaming' que utiliza para mitigar vieses e usos maliciosos. A transparência foi elogiada.",
            published_at=now - timedelta(days=10),
            url="https://example.com/openai-safety"
        )
        art6.categories.append(cat_pesquisas)
        art6.companies.append(comp_openai)

        art7 = artigo(7,
            title="Microsoft Copilot agora integrado ao Windows Explorer",
            summary="A IA da Microsoft chega ao gerenciador de arquivos.",
            content="Uma atualização recente do Windows 11 trouxe o Copilot diretamente para o Explorer, permitindo resumir documentos, organizar arquivos e buscar conteúdo semanticamente.",
            published_at=now - timedelta(days=8),
            url="https://example.com/copilot-explorer"
        )
        art7.categories.append(cat_ia)
        art7.companies.append(comp_microsoft)

        art8 = artigo(8,
            title="Pixel 9 Pro: Vazam primeiras imagens e especificações",
            summary="O próximo flagship do Google terá novo design e chip Tensor G4.",
            content="Renderizações vazadas mostram um Pixel 9 Pro com laterais planas e um módulo de câmera redesenhado. Espera-se que o novo chip Tensor G4 traga grandes avanços em processamento de IA.",
            published_at=now - timedelta(days=6),
            url="https://example.com/pixel-9-leak"
        )
        art8.categories += [cat_hardware, cat_lancamentos]
        art8.companies.append(comp_google)

        art9 = artigo(9,
            title="Meta descontinua seu projeto de óculos AR de ponta",
            summary="A empresa irá focar em dispositivos de realidade mista mais acessíveis.",
            content="Fontes internas da Meta indicam que o projeto 'Orion' de óculos de Realidade Aumentada foi pausado. O foco agora se volta para o sucessor do Quest 3 e dispositivos mais baratos.",
            published_at=now - timedelta(days=12),
            url="https://example.com/meta-ar-pause"
        )
        art9.categories += [cat_hardware, cat_pesquisas]
        art9.companies.append(comp_meta)

        art10 = artigo(10,
            title="Relembrando o lançamento do GPT-3",
            summary="Um olhar sobre o modelo que mudou o jogo da IA.",
            content="Há alguns anos, o GPT-3 foi lançado e redefiniu o que esperávamos de modelos de linguagem. Sua capacidade de gerar texto coeso impressionou pesquisadores do Google e Meta.",
            published_at=now - timedelta(days=365),
            url="https://example.com/gpt-3-retro"
        )
        art10.categories.append(cat_ia)
        art10.companies.append(comp_openai)

        art11 = artigo(11,
            title="Microsoft expande data centers na Europa",
            summary="Investimento visa suportar demanda crescente por Azure e IA.",
            content="A Microsoft anunciou um investimento multibilionário para construir novos data centers na Alemanha e Espanha, focando em soberania de dados e serviços de IA.",
            published_at=now - timedelta(days=7),
            url="https://example.com/msft-datacenters"
        )
        art11.categories.append(cat_ia)
        art11.companies.append(comp_microsoft)

        art12 = artigo(12,
            title="Google otimiza buscas com IA generativa",
            summary="Resultados de busca agora incluem resumos gerados por IA.",
            content="O Google começou a implementar resumos gerados por IA (SGE) no topo de suas páginas de resultado, mudando a forma como usuários interagem com a busca.",
            published_at=now - timedelta(days=9),
            url="https://example.com/google-sge"
        )
        art12.categories += [cat_ia, cat_pesquisas]
        art12.companies.append(comp_google)

        art13 = artigo(13,
            title="Llama 3 da Meta: Análise de desempenho",
            summary="Benchmarks colocam o Llama 3 contra o GPT-4 da OpenAI.",
            content="Novos benchmarks independentes mostram que o Llama 3 da Meta supera o GPT-4 em tarefas de raciocínio, mas ainda fica atrás em geração de código. A competição é acirrada.",
            published_at=now - timedelta(days=15),
            url="https://example.com/llama-3-benchmarks"
        )
        art13.categories += [cat_ia, cat_pesquisas]
        art13.companies += [comp_meta, comp_openai]

        art14 = artigo(14,
            title="Rumores sobre o Apple Vision Pro 2",
            summary="A próxima geração do headset da Apple pode ser mais leve.",
            content="Embora o Vision Pro original ainda seja novo, rumores sugerem que a Apple já trabalha em um sucessor mais leve e com bateria de maior duração. O foco é o conforto.",
            published_at=now - timedelta(days=11),
            url="https://example.com/vision-pro-2"
        )
        art14.categories += [cat_hardware, cat_lancamentos]
        # sem empresa propositalmente

        art15 = artigo(15,
            title="A ética da IA na medicina: Novo estudo do Google Health",
            summary="Google Health explora o viés em diagnósticos por IA.",
            content="Um estudo aprofundado do Google Health analisa como modelos de IA podem perpetuar vieses raciais em diagnósticos médicos e propõe novas métricas de justiça.",
            published_at=now - timedelta(days=20),
            url="https://example.com/google-health-ethics"
        )
        art15.categories.append(cat_pesquisas)
        art15.companies.append(comp_google)
        
        # Salva todos os artigos no banco
        db.add_all(artigos)
        db.commit()

        # 6. ALTERADO: Bloco de Broadcast agora usa 'requests'
        print("\n--- DISPARANDO BROADCAST VIA HTTP ---")
        try:
            url = "http://localhost:8000/api/dev/emit" 
            payload = {"type": "NEW_ARTICLES"}
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                print("Broadcast disparado com sucesso via API.")
            else:
                print(f"Falha ao disparar broadcast. API retornou status: {response.status_code}")
                print(f"Resposta: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("ERRO DE CONEXÃO: Não foi possível conectar ao servidor FastAPI (localhost:8000).")
            print("Verifique se o Terminal 1 (Uvicorn) está rodando.")
        except Exception as e:
            print(f"ERRO ao disparar broadcast: {e}")
        print("-------------------------------------\n")

        print(f"Banco de dados populado com {db.query(Article).count()} artigos.")
        print(f"Categorias: {[c.name for c in db.query(Category).all()]}")
        print(f"Empresas: {[c.name for c in db.query(Company).all()]}")

    except Exception as e:
        print(f"Erro ao popular o banco de dados: {e}")
        db.rollback()
        raise
    finally:
        db.close()
        print("Sessão do banco fechada.")

if __name__ == "__main__":
    print("Iniciando o script de seed...")
    # 7. ALTERADO: De volta para chamada síncrona
    seed_database()