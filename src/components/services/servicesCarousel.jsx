"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  ChevronLeft, 
  ChevronRight, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  Wind, 
  Car, 
  Search, 
  Zap 
} from 'lucide-react';
import styles from './servicesCarousel.module.css';

// Lista com os 7 Serviços
const services = [
  {
    icon: <Droplets size={32} />,
    title: "Lavagem Detalhada",
    desc: "Limpeza minuciosa de cada canto do veículo, utilizando pincéis macios e produtos neutros."
  },
  {
    icon: <Sparkles size={32} />,
    title: "Polimento Técnico",
    desc: "Correção da pintura removendo riscos, hologramas e devolvendo o brilho profundo."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Vitrificação Cerâmica",
    desc: "Proteção de alta dureza (9H) que repele água e sujeira por até 3 anos."
  },
  {
    icon: <Wind size={32} />,
    title: "Oxi-Sanitização",
    desc: "Eliminação de fungos, bactérias e odores internos através de tecnologia de ozônio."
  },
  {
    icon: <Car size={32} />,
    title: "Higienização Interna",
    desc: "Limpeza profunda de bancos, teto e carpetes com extração de sujeira."
  },
  {
    icon: <Search size={32} />,
    title: "Cristalização de Vidros",
    desc: "Aplicação de repelente de água nos vidros para maior visibilidade na chuva."
  },
  {
    icon: <Zap size={32} />,
    title: "Limpeza de Motor",
    desc: "Limpeza técnica e proteção dos componentes do motor sem uso de água sob pressão."
  }
];

export default function ServicesCarousel() {
  // Configuração do Embla com Autoplay
  // stopOnInteraction: false -> garante que o autoplay VOLTE a funcionar depois do clique
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  // Função para voltar o slide e reiniciar o timer
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    
    // Acessa o plugin de autoplay e reinicia a contagem
    const autoplay = emblaApi.plugins().autoplay;
    if (autoplay) autoplay.reset();
    
  }, [emblaApi]);

  // Função para avançar o slide e reiniciar o timer
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();

    // Acessa o plugin de autoplay e reinicia a contagem
    const autoplay = emblaApi.plugins().autoplay;
    if (autoplay) autoplay.reset();

  }, [emblaApi]);

  return (
    <div className={styles.carouselWrapper}>
      
      {/* Botão Anterior */}
      <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={scrollPrev}>
        <ChevronLeft size={24} />
      </button>

      {/* Viewport do Embla */}
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {services.map((service, index) => (
            <div className={styles.emblaSlide} key={index}>
              <div className={styles.card}>
                <div className={styles.iconBox}>
                  {service.icon}
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão Próximo */}
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={scrollNext}>
        <ChevronRight size={24} />
      </button>

    </div>
  );
}