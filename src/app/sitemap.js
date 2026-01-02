export default function sitemap() {
  const baseUrl = 'https://urban-front-2.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Adicione outras rotas públicas aqui se tiver, ex: /servicos, /contato
  ]
}