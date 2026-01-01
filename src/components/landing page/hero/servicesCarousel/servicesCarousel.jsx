"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './servicesCarousel.module.css';
import { categories } from '../data/serviceDb';

export default function ServicesCarousel({ onCategorySelect }) {
  // Configuração do Embla (Autoplay para em 4s, volta a rodar após interação)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    const autoplay = emblaApi.plugins().autoplay;
    if (autoplay) autoplay.reset();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
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
          {/* Loop pelas categorias do DB */}
          {Object.entries(categories).map(([id, category]) => {
            const IconComponent = category.icon; // Pega o componente do ícone dinamicamente

            return (
              <div className={styles.emblaSlide} key={id}>
                <div 
                  className={styles.card} 
                  onClick={() => onCategorySelect(parseInt(id))} // Ação de Filtrar
                  role="button" // Acessibilidade
                  tabIndex={0}
                >
                  <div className={styles.iconBox}>
                    {/* Renderiza o ícone que veio do DB */}
                    <IconComponent size={32} />
                  </div>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                  <span className={styles.clickHint}>Ver serviços</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão Próximo */}
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={scrollNext}>
        <ChevronRight size={24} />
      </button>

    </div>
  );
}