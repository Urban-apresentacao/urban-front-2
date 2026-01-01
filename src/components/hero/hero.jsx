import React from 'react';
import styles from './hero.module.css';

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Estética automotiva de <span className={styles.highlight}>alto padrão</span> para quem ama seu carro.
          </h1>
          <p className={styles.heroText}>
            Não é apenas lavagem. É um tratamento completo de rejuvenescimento e proteção para o seu veículo, utilizando as melhores técnicas do mercado.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary}>Agendar Serviço</button>
            <button className={styles.btnSecondary}>Conhecer Planos</button>
          </div>
        </div>

        {/* Placeholder da Imagem */}
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroImagePlaceholder}>
            <span>[FOTO DO CARRO BRILHANDO]</span>
            <span style={{fontSize: '0.8rem', marginTop: '10px', fontWeight: 'normal'}}>
             (Imagem ajustada para cover)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}