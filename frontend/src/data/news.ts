// Em: data/news.ts

// 1. Definição do tipo (AGORA COM "sourceUrl")
export type NewsArticle = {
  id: number
  title: string
  description: string
  category: string
  image: string
  date: string
  content: string 
  source: string 
  sourceUrl: string // <--- O CAMPO QUE FALTAVA
}

// 3. Seus dados (AGORA COM "sourceUrl")
export const newsData: NewsArticle[] = [
  {
    id: 1,
    title: "OpenAI Lança Novo Modelo de IA com Capacidades Avançadas",
    description: "A OpenAI apresentou um novo modelo de linguagem...",
    category: "Lançamentos",
    image: "/openai-ai-model-launch.jpg",
    date: "2025-10-24",
    content: `
      <p>A OpenAI anunciou hoje o lançamento do GPT-5...</p>
      <h2>Principais Avanços</h2>
      <ul>...</ul>
      <h2>Impacto na Indústria</h2>
      <p>Especialistas acreditam...</p>
    `,
    source: "OpenAI",
    sourceUrl: "https://openai.com/blog/gpt-5-announcement", // <--- ADICIONADO
  },
  {
    id: 2,
    title: "Google Investe Bilhões em Infraestrutura de IA",
    description: "A gigante de tecnologia anuncia investimento massivo...",
    category: "Pesquisas",
    image: "/google-ai-infrastructure.jpg",
    date: "2025-10-23",
    content: `
      <h2>Investimento Estratégico</h2>
      <p>O Google detalhou seu plano...</p>
      <blockquote>...</blockquote>
    `,
    source: "Google",
    sourceUrl: "https://blog.google/technology/ai/infrastructure-investment/", // <--- ADICIONADO
  },
  {
    id: 3,
    title: "Meta Desenvolve Novo Algoritmo de Recomendação",
    description: "Pesquisadores da Meta publicam artigo sobre avanços...",
    category: "Pesquisas",
    image: "/meta-recommendation-algorithm.jpg",
    date: "2025-10-22",
    content: `
      <h2>Recomendações Mais Precisas</h2>
      <p>O novo algoritmo da Meta...</p>
      <ul>...</ul>
    `,
    source: "Meta",
    sourceUrl: "https://ai.meta.com/blog/contentflow-recommendation-algorithm/", // <--- ADICIONADO
  },
  {
    id: 4,
    title: "Ferramentas de IA Generativa Ganham Popularidade",
    description: "Novas ferramentas de IA para criação de conteúdo...",
    category: "Ferramentas",
    image: "/ai-generative-tools.jpg",
    date: "2025-10-21",
    content: `
      <h2>A Explosão Criativa</h2>
      <p>O mercado de ferramentas generativas...</p>
      <ul>...</ul>
    `,
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com/2025/10/21/generative-ai-tools-boom/", // <--- ADICIONADO
  },
  {
    id: 5,
    title: "Reguladores Discutem Novas Políticas para IA",
    description: "Governos ao redor do mundo começam a estabelecer marcos...",
    category: "Políticas",
    image: "/ai-regulation-policy.jpg",
    date: "2025-10-20",
    content: `
      <h2>O Desafio da Regulamentação</h2>
      <p>O debate sobre regulamentação...</p>
      <p><strong>Pontos principais...</strong></p>
      <ul>...</ul>
    `,
    source: "Reuters",
    sourceUrl: "https://www.reuters.com/technology/global-leaders-discuss-ai-regulation/", // <--- ADICIONADO
  },
  {
    id: 6,
    title: "Startup de IA Recebe Financiamento Recorde",
    description: "Empresa emergente de inteligência artificial levanta US$ 500 milhões...",
    category: "Últimas notícias",
    image: "/ai-startup-funding.jpg",
    date: "2025-10-19",
    content: `
      <h2>'AI Future' Levanta $500M</h2>
      <p>A startup 'AI Future'...</p>
      <p>Os fundos serão usados...</p>
    `,
    source: "VentureBeat",
    sourceUrl: "https://venturebeat.com/ai/ai-future-raises-500m-series-b/", // <--- ADICIONADO
  },
  {
    id: 7,
    title: "Pesquisa Revela Impacto da IA no Mercado de Trabalho",
    description: "Estudo mostra como inteligência artificial está transformando...",
    category: "Pesquisas",
    image: "/ai-impact-workforce.jpg",
    date: "2025-10-18",
    content: `
      <h2>Novas Funções, Novos Desafios</h2>
      <p>Um novo estudo publicado...</p>
      <p>A requalificação...</p>
    `,
    source: "Stanford University",
    sourceUrl: "https://hai.stanford.edu/news/ai-impact-workforce-study/", // <--- ADICIONADO
  },
  {
    id: 8,
    title: "Novo Framework de IA Simplifica Desenvolvimento",
    description: "Desenvolvedores agora têm acesso a ferramentas mais acessíveis...",
    category: "Ferramentas",
    image: "/ai-development-framework.jpg",
    date: "2025-10-17",
    content: `
      <h2>Democratizando a IA</h2>
      <p>O 'SimpleAI' é um novo framework...</p>
    `,
    source: "GitHub",
    sourceUrl: "https://github.blog/2025-10-17-simpleai-framework-launch/", // <--- ADICIONADO
  },
  {
    id: 9,
    title: "Universidades Expandem Programas de IA",
    description: "Instituições de ensino aumentam investimento em cursos...",
    category: "Últimas notícias",
    image: "/university-ai-programs.jpg",
    date: "2025-10-16",
    content: `
      <h2>Foco na Próxima Geração</h2>
      <p>Grandes universidades...</p>
    `,
    source: "MIT News",
    sourceUrl: "https://news.mit.edu/2025/expansion-ai-ethics-labs/", // <--- ADICIONADO
  },
  {
    id: 10,
    title: "Segurança em IA Torna-se Prioridade Global",
    description: "Especialistas alertam sobre importância de desenvolver IA segura...",
    category: "Políticas",
    image: "/ai-security-safety.jpg",
    date: "2025-10-15",
    content: `
      <h2>Alinhamento e Controle</h2>
      <p>Em conferência global...</p>
    `,
    source: "Nações Unidas",
    sourceUrl: "https://www.un.org/en/ai-safety-summit-highlights/", // <--- ADICIONADO
  },
  {
    id: 11,
    title: "Aplicações de IA em Medicina Mostram Resultados Promissores",
    description: "Pesquisadores demonstram como IA pode melhorar diagnósticos...",
    category: "Lançamentos",
    image: "/ai-medicine-healthcare.jpg",
    date: "2025-10-14",
    content: `
      <h2>Diagnósticos Mais Rápidos</h2>
      <p>Novos algorítmos de IA...</p>
      <p>Os resultados mostram...</p>
    `,
    source: "Nature Medicine",
    sourceUrl: "https://www.nature.com/articles/s41591-025-01234-x", // <--- ADICIONADO
  },
  {
    id: 12,
    title: "Empresas Adotam IA para Otimizar Operações",
    description: "Organizações implementam soluções de IA para aumentar eficiência...",
    category: "Últimas notícias",
    image: "/business-ai-optimization.jpg",
    date: "2025-10-13",
    content: `
      <h2>Eficiência Operacional</h2>
      <p>Da logística ao atendimento ao cliente...</p>
    `,
    source: "Forbes",
    sourceUrl: "https://www.forbes.com/sites/ai/2025/10/13/how-ai-is-optimizing-business-operations/", // <--- ADICIONADO
  },
]

