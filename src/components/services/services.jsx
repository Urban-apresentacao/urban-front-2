import React from 'react';
import styles from './services.module.css';
import ServicesCarousel from './servicesCarousel'; // Importando o carrossel que já existe

export default function Services() {
  return (
    <section id="servicos" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nossos Serviços</h2>
          <p className={styles.sectionSubtitle}>
            Cuidado premium para máquinas exigentes. 
            <span className={styles.mobileHint}> Deslize para explorar.</span>
          </p>
        </div>
        
        {/* O Carrossel é chamado aqui dentro */}
        <ServicesCarousel />
        
      </div>
    </section>
  );
}