// frontend/src/data/news.ts
import type { NewsArticle } from '@/types/news'; // Importa seu tipo existente

// Exporta os dados com o tipo correto
export const newsData: NewsArticle[] = [
  {
    id: 1,
    title: 'OpenAI Lança Novo Modelo de IA com Capacidades Avançadas',
    summary: 'A OpenAI apresentou hoje o GPT-5, um modelo que promete revolucionar a interação...',
    url: 'https://example.com/news/1',
    image_url: 'https://images.unsplash.com/photo-1677756128484-aef87f7d1487?q=80&w=1932&auto=format&fit=crop',
    published_at: '2025-10-23T12:00:00Z',
    categories: [{ id: 1, name: 'Lançamentos' }],
    source: 'OpenAI',
    // --- NOVO CAMPO 'content' ---
    content: `
      <p>A OpenAI anunciou hoje o lançamento do GPT-5, seu mais novo modelo de linguagem de grande escala. Especialistas da indústria acreditam que este avanço representa um salto significativo em direção à inteligência artificial geral (AGI).</p>
      <p>Principais Avanços:</p>
      <ul>
        <li>Compreensão de contexto multimodal aprimorada.</li>
        <li>Capacidade de raciocínio complexo em domínios especializados.</li>
        <li>Redução drástica em alucinações e geração de fatos incorretos.</li>
      </ul>
      <p>O impacto na indústria de tecnologia é esperado para ser imediato, com parceiros beta já relatando ganhos de produtividade sem precedentes.</p>
    `
  },
  {
    id: 2,
    title: 'Artigo de Pesquisa Sobre IA',
    summary: 'Outro resumo interessante sobre IA e seu impacto no mercado de trabalho.',
    url: 'https://example.com/news/2',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1770&auto=format&fit=crop',
    published_at: '2025-10-25T18:30:00Z',
    categories: [{ id: 2, name: 'Pesquisas' }],
    source: 'Stanford University',
    content: `<p>Um novo estudo publicado pela Universidade de Stanford explora o impacto da IA generativa no mercado de trabalho. Ao contrário de previsões pessimistas, o estudo sugere um aumento na demanda por "colaboradores de IA", profissionais especializados em treinar e interagir com modelos de IA.</p>`
  },
  {
    id: 3,
    title: 'Notícia de Última Hora sobre Segurança',
    summary: 'Aconteceu agora, uma nova aliança global de segurança em IA foi formada.',
    url: 'https://example.com/news/3',
    image_url: 'https://images.unsplash.com/photo-1696253910356-d70b42b0e2c8?q=80&w=1770&auto=format&fit=crop',
    published_at: '2025-10-26T15:45:00Z',
    categories: [{ id: 3, name: 'Políticas' }],
    source: 'Nações Unidas',
    content: `<p>Em uma reunião de emergência, líderes globais anunciaram a formação de uma força-tarefa internacional para regulamentar o desenvolvimento de IA superinteligente, focando em protocolos de segurança e transparência.</p>`
  },
  {
    id: 4,
    title: 'Ferramentas de IA Generativa Ganham Popularidade',
    summary: 'Novas ferramentas de IA para criação de conteúdo estão mudando o jogo para criadores.',
    url: 'https://example.com/news/4',
    image_url: 'https://images.unsplash.com/photo-1692147434645-ac52c6f17734?q=80&w=1854&auto=format&fit=crop',
    published_at: '2025-10-20T10:00:00Z',
    categories: [{ id: 4, name: 'Ferramentas' }],
    source: 'TechCrunch',
    content: `<p>A adoção de ferramentas de IA generativa para design gráfico, composição musical e escrita de roteiros disparou no último trimestre. Analisamos as plataformas líderes de mercado.</p>`
  },
];