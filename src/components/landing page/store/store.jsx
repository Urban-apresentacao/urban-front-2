"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './store.module.css';
import { products } from './data/productsDb';
import Image from 'next/image';

export default function StoreSection() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [defaultLimit, setDefaultLimit] = useState(8);
  const getInitialCount = () => (window.innerWidth < 768 ? 3 : 8);

  useEffect(() => {
    const handleResize = () => {
      const count = getInitialCount();
      setDefaultLimit(count);
      setVisibleCount(count);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShowMore = () => {
    setVisibleCount(products.length);
  };

  const handleShowLess = () => {
    setVisibleCount(defaultLimit);
    
    const section = document.getElementById('loja');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="loja" className={styles.storeSection}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <span className={styles.preTitle}>Nossa Loja Física</span>
          <h2 className={styles.title}>Produtos <span className={styles.highlight}>Profissionais</span></h2>
          <p className={styles.subtitle}>
            Venha nos visitar e leve para casa os mesmos produtos que utilizamos para deixar os carros impecáveis.
          </p>
        </div>

        <div className={styles.productsGrid}>
          {products.slice(0, visibleCount).map((product) => (
            <div key={product.id} className={styles.card}>
              
              {product.tag && <span className={styles.tag}>{product.tag}</span>}

              <div className={styles.imageWrapper}>
                <div className={styles.placeholderBg}>
                   <ShoppingBag size={32} color="#9ca3af" />
                </div>
                <Image src={product.image} alt={product.name} fill style={{objectFit: 'contain'}} />
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={styles.price}>{product.price}</span>
              </div>
            </div>
          ))}
        </div>

        {products.length > defaultLimit && (
          <div className={styles.footer} style={{ marginBottom: '4rem', textAlign: 'center' }}>
            
            {visibleCount < products.length ? (
              <button className={styles.viewAllBtn} onClick={handleShowMore}>
                Ver todos os produtos <ChevronDown size={20} />
              </button>
            ) : (
              <button className={styles.viewAllBtn} onClick={handleShowLess}>
                Ver menos produtos <ChevronUp size={20} />
              </button>
            )}

          </div>
        )}

        <div className={styles.locationContainer}>
          <div className={styles.locationContent}>
            <div className={styles.locationText}>
              <span className={styles.locationLabel}>Onde Estamos</span>
              <h3 className={styles.locationTitle}>Venha comprar seu produto ou agendar um serviço!</h3>
              
              <p className={styles.addressText}>
                <MapPin className={styles.icon} size={20} />
                Residencial Primavera, Rua 4 n° 119 <br />
                Herculândia - SP
              </p>
              
              <p className={styles.timeText}>
                Segunda a Sexta: 09h às 17h<br />
              </p>

              <a 
                href="https://maps.google.com/?q=AutoLimp+Estetica" 
                target="_blank" 
                className={styles.routeBtn}
              >
                <Navigation size={18} /> Traçar Rota
              </a>
            </div>

            <div className={styles.mapWrapper}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d446.71798718180605!2d-50.37848961921088!3d-22.012482474102686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495bd000d47181d%3A0xbc8e7fff1430e75a!2sAutolimp%20produtos%20e%20estetica%20automotiva!5e1!3m2!1spt-BR!2sbr!4v1767292827035!5m2!1spt-BR!2sbr"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}