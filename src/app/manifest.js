export default function manifest() {
  return {
    name: 'AutoLimp Estética Automotiva',
    short_name: 'AutoLimp',
    description: 'Cuidado premium para seu veículo em Herculândia',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}