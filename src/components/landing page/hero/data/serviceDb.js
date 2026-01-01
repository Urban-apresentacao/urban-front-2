import { Car, Droplets, Sparkles, Shield, Scan, Disc, Armchair, Wind, SprayCan, Wrench } from 'lucide-react';

// 1. Mapeamento de Categorias (ID -> Nome + Ícone)
export const categories = {
  1: { name: "Lavagem & Higienização", icon: Droplets },
  2: { name: "Polimento & Proteção", icon: Sparkles },
  3: { name: "Vidros & Faróis", icon: Scan },
  4: { name: "Rodas & Pneus", icon: Disc },
  5: { name: "Estética Interna", icon: Armchair },
  6: { name: "Odores & Sanitização", icon: Wind },
  7: { name: "Funilaria Express", icon: SprayCan },
  8: { name: "Personalização", icon: Car },
  9: { name: "Reparos & Martelinho", icon: Wrench },
  10: { name: "Motor & Manutenção", icon: Shield }
};

// 2. Lista de Serviços
export const servicesList = [
  { id: 1, catId: 1, title: "Lavagem externa (tradicional)", desc: "Lavagem externa convencional do veiculo.", price: "R$ 30,00" },
  { id: 2, catId: 1, title: "Lavagem externa (a seco)", desc: "Lavagem externa do veiculo sem uso de agua.", price: "R$ 40,00" },
  { id: 3, catId: 1, title: "Lavagem interna completa", desc: "Limpeza completa do interior do veiculo.", price: "R$ 60,00" },
  { id: 4, catId: 1, title: "Limpeza de estofados", desc: "Limpeza profunda de estofados.", price: "R$ 120,00" },
  { id: 5, catId: 1, title: "Limpeza de carpetes", desc: "Limpeza detalhada dos carpetes do veiculo.", price: "R$ 70,00" },
  { id: 6, catId: 1, title: "Higienizacao de ar-condicionado", desc: "Higienizacao do sistema de ar-condicionado.", price: "R$ 80,00" },
  { id: 7, catId: 1, title: "Descontaminacao de pintura", desc: "Remocao de contaminantes da pintura.", price: "R$ 100,00" },
  { id: 8, catId: 2, title: "Polimento de pintura", desc: "Polimento completo da pintura do veiculo.", price: "R$ 200,00" },
  { id: 9, catId: 2, title: "Espelhamento", desc: "Espelhamento da pintura para brilho intenso.", price: "R$ 250,00" },
  { id: 10, catId: 2, title: "Vitrificacao", desc: "Aplicacao de revestimento vitrificado.", price: "R$ 300,00" },
  { id: 11, catId: 2, title: "Enceramento", desc: "Aplicacao de cera para protecao da pintura.", price: "R$ 80,00" },
  { id: 12, catId: 2, title: "Selagem de pintura", desc: "Selagem da pintura para protecao prolongada.", price: "R$ 150,00" },
  { id: 13, catId: 2, title: "Pelicula de proteção (PPF)", desc: "Aplicacao de pelicula protetora de pintura.", price: "R$ 500,00" },
  { id: 14, catId: 3, title: "Polimento de farois", desc: "Polimento para clarear farois.", price: "R$ 60,00" },
  { id: 15, catId: 3, title: "Restauracao de farois", desc: "Restauracao completa de farois.", price: "R$ 120,00" },
  { id: 16, catId: 3, title: "Cristalizacao de vidros", desc: "Aplicacao de repelente de agua nos vidros.", price: "R$ 50,00" },
  { id: 17, catId: 3, title: "Aplicacao de insulfilm", desc: "Aplicacao de pelicula insulfilm.", price: "R$ 200,00" },
  { id: 18, catId: 4, title: "Limpeza de rodas e calotas", desc: "Limpeza detalhada de rodas e calotas.", price: "R$ 40,00" },
  { id: 19, catId: 4, title: "Polimento de rodas", desc: "Polimento para brilho intenso das rodas.", price: "R$ 100,00" },
  { id: 20, catId: 4, title: "Protetores de pneu", desc: "Aplicacao de produto protetor nos pneus.", price: "R$ 30,00" },
  { id: 21, catId: 4, title: "Pintura e restauracao de rodas", desc: "Pintura e restauracao de rodas.", price: "R$ 250,00" },
  { id: 22, catId: 5, title: "Limpeza de painel e console", desc: "Limpeza detalhada do painel e console.", price: "R$ 60,00" },
  { id: 23, catId: 5, title: "Hidratacao de couro", desc: "Limpeza e hidratacao de bancos de couro.", price: "R$ 150,00" },
  { id: 24, catId: 5, title: "Hidratacao de plasticos", desc: "Limpeza e hidratacao de plasticos internos.", price: "R$ 80,00" },
  { id: 25, catId: 5, title: "Limpeza de portas", desc: "Limpeza detalhada de portas e macanetas.", price: "R$ 50,00" },
  { id: 26, catId: 5, title: "Dutos de ventilacao", desc: "Limpeza detalhada dos dutos de ventilacao.", price: "R$ 70,00" },
  { id: 27, catId: 6, title: "Tratamento com ozonio", desc: "Remocao de odores com tratamento de ozonio.", price: "R$ 150,00" },
  { id: 28, catId: 6, title: "Neutralizacao de odores", desc: "Neutralizacao de odores no veiculo.", price: "R$ 100,00" },
  { id: 29, catId: 7, title: "Retoque de pintura", desc: "Retoque de pintura para corrigir imperfeicoes.", price: "R$ 200,00" },
  { id: 30, catId: 7, title: "Pintura parcial", desc: "Pintura parcial para correcao estetica.", price: "R$ 300,00" },
  { id: 31, catId: 8, title: "Envelopamento (vinil)", desc: "Envelopamento completo do veiculo com vinil.", price: "R$ 800,00" },
  { id: 32, catId: 8, title: "Pintura de pincas de freio", desc: "Pintura personalizada das pincas de freio.", price: "R$ 150,00" },
  { id: 33, catId: 8, title: "Adesivos decorativos", desc: "Aplicacao de adesivos decorativos no veiculo.", price: "R$ 50,00" },
  { id: 34, catId: 8, title: "Instalacao de spoilers", desc: "Instalacao de spoilers e acessorios externos.", price: "R$ 300,00" },
  { id: 35, catId: 9, title: "Remocao de riscos", desc: "Remocao de riscos e arranhoes superficiais.", price: "R$ 200,00" },
  { id: 36, catId: 9, title: "Martelinho de ouro", desc: "Reparo de amassados sem necessidade de pintura.", price: "R$ 300,00" },
  { id: 37, catId: 9, title: "Remocao de manchas", desc: "Remocao de manchas da superficie do veiculo.", price: "R$ 100,00" },
  { id: 38, catId: 10, title: "Lavagem de motor", desc: "Lavagem detalhada do motor do veiculo.", price: "R$ 80,00" },
  { id: 39, catId: 10, title: "Polimento de escapamento", desc: "Polimento do sistema de escapamento.", price: "R$ 50,00" },
  { id: 40, catId: 10, title: "Revitalizacao de teto solar", desc: "Revitalizacao e limpeza do teto solar.", price: "R$ 150,00" }
];