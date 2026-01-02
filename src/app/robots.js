export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Protege áreas logadas de aparecerem no Google
    },
    sitemap: 'https://urban-front-2.vercel.app/sitemap.xml',
  }
}