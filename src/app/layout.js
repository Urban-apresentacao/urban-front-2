import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const baseUrl = "https://urban-front-2.vercel.app";


export const metadata = {
  metadataBase: new URL("https://urban-front-2.vercel.app"),
  title: {
    default: "AutoLimp | Estética Automotiva em Herculândia - SP",
    template: "%s | AutoLimp",
  },
  description: "Transforme seu carro na AutoLimp. Especialistas em polimento, vitrificação, higienização interna e lavagem detalhada em Herculândia-SP. Agende seu horário!",
  
  // --- LISTA DE KEYWORDS ATUALIZADA ---
  keywords: [
    // Identidade e Localização
    "AutoLimp Herculândia",
    "Lava rápido em Herculândia",
    "Estética Automotiva Herculândia",
    "Lavagem de carros Herculândia",
    "Limpeza automotiva SP",
    
    // Serviços de Alto Valor (Pintura)
    "Polimento automotivo",
    "Cristalização de pintura",
    "Vitrificação de pintura",
    "Espelhamento de pintura",
    "Remoção de riscos automotivos",
    "Descontaminação de pintura",
    "Remoção de chuva ácida",

    // Higienização e Interna
    "Higienização interna de veículos",
    "Limpeza de bancos automotivos",
    "Limpeza de teto e carpete",
    "Hidratação de bancos de couro",
    "Oxi-sanitização automotiva",
    "Tirar cheiro de carro",

    // Lavagem e Motor
    "Lavagem detalhada",
    "Lavagem técnica de motor",
    "Lavagem de chassi",
    "Lavagem americana",
    "Cera automotiva premium",

    // Termos da Indústria (Detailing)
    "Detailing",
    "Car Detail",
    "Estética automotiva premium",
    "Cuidado automotivo"
  ],
  // -------------------------------------

  authors: [{ name: "AutoLimp" }],
  creator: "AutoLimp",
  publisher: "AutoLimp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AutoLimp - O brilho que seu carro merece",
    description: "Referência em estética automotiva em Herculândia. Polimento, Higienização e muito mais.",
    url: "https://urban-front-2.vercel.app",
    siteName: "AutoLimp",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo_autolimp.jpeg", 
        width: 1200,
        height: 630,
        alt: "Resultado de serviço na AutoLimp Estética Automotiva",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  // Dados Estruturados para Negócio Local (Schema.org)
  // Isso ajuda MUITO a aparecer no Google Maps e pesquisas locais
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoWash", // Tipo específico para lava-rápido/estética
    "name": "AutoLimp",
    "image": `${baseUrl}/og-image.jpg`,
    "description": "Estética automotiva especializada em Herculândia-SP.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Endereço da Loja", // PREENCHA AQUI O ENDEREÇO REAL
      "addressLocality": "Herculândia",
      "addressRegion": "SP",
      "postalCode": "17650-000", // CEP de Herculândia
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-21.9953", // Coordenada aproximada de Herculândia (Ajuste para a exata da loja)
      "longitude": "-50.3925"
    },
    "url": baseUrl,
    "telephone": "+5514999999999", // PREENCHA O TELEFONE REAL
    "priceRange": "$$"
  };

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Injeção do Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
