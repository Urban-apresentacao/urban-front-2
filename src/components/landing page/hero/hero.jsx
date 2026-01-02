"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './hero.module.css';
import ServicesModal from './modalServices/servicesModal'; 
import ServicesCarousel from './servicesCarousel/servicesCarousel'; 

export default function Hero() {
  const [showServices, setShowServices] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setShowServices(true);
  };

  const handleShowAll = () => {
    setSelectedCategory(null);
    setShowServices(true);
  };

  return (
    <>
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>  
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Estética automotiva de <span className={styles.highlight}>alto padrão</span> para quem ama seu carro.
              </h1>
              <p className={styles.heroText}>
                Não é apenas lavagem. É um tratamento completo de rejuvenescimento e proteção para o seu veículo, utilizando as melhores técnicas do mercado.
              </p>
              
              <div className={styles.heroActions}>
                <button className={styles.btnPrimary}>Agendar Serviço</button>
                <button className={styles.btnSecondary} onClick={handleShowAll}>
                  Conhecer Serviços
                </button>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              <Image 
                  src="/images/imagem_byd.jpg"
                  alt="Carro esteticamente tratado"
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
            </div>
          </div>
          <ServicesCarousel onCategorySelect={handleCategoryClick} />
        </div>
      </section>

      <ServicesModal 
        isOpen={showServices} 
        onClose={() => setShowServices(false)} 
        selectedCategoryId={selectedCategory}
      />
    </>
  );
}