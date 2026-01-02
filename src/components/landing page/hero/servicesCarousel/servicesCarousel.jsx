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
      
      <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={scrollPrev}>
        <ChevronLeft size={24} />
      </button>

      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {Object.entries(categories).map(([id, category]) => {
            const IconComponent = category.icon;

            return (
              <div className={styles.emblaSlide} key={id}>
                <div 
                  className={styles.card} 
                  onClick={() => onCategorySelect(parseInt(id))}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.iconBox}>
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

      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={scrollNext}>
        <ChevronRight size={24} />
      </button>

    </div>
  );
}