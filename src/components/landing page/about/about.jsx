"use client";

import React from 'react';
import Image from 'next/image';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import styles from './about.module.css';

export default function About() {

  const whatsappNumber = "5518996223545"; 

  const openWhatsApp = () => {
    const mensagem = "Olá! Gostaria de mais informações sobre os serviços da AutoLimp.";
    const mensagemCodificada = encodeURIComponent(mensagem);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const link = isMobile
      ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`;

    window.open(link, "_blank");
  };

  return (
    <section id="sobre" className={styles.about}>
      <div className={styles.container}>
        
        {/* Coluna da Imagem */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <Image 
              src="/images/equipe_autolimp.jpg" 
              alt="Equipe AutoLimp cuidando de um carro"
              fill
              style={{ objectFit: 'cover' }}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.floatingCard}>
            <div className={styles.iconCircle}>
              <Star size={24} fill="#fbbf24" color="#fbbf24" />
            </div>
            <div>
              <span className={styles.cardTitle}>Qualidade Premium</span>
              <span className={styles.cardDesc}>Satisfação Garantida</span>
            </div>
          </div>
        </div>

        {/* Coluna do Conteúdo */}
        <div className={styles.aboutContent}>
          <h4 className={styles.tagline}>Sobre a AutoLimp</h4>
          <h2 className={styles.sectionTitle}>
            Paixão por detalhes, obsessão por brilho.
          </h2>

          <p className={styles.text}>
            Fundada com o objetivo de elevar o nível da estética automotiva na região, a <strong>AutoLimp</strong> nasceu da necessidade de um serviço que tratasse cada veículo como único.
          </p>

          <p className={styles.text}>
            Entendemos que seu carro é uma extensão da sua personalidade e um investimento valioso. Por isso, utilizamos produtos biodegradáveis de tecnologia alemã e equipamentos de precisão.
          </p>

          <ul className={styles.checkList}>
            <li>
              <CheckCircle size={20} className={styles.checkIcon} />
              Profissionais certificados
            </li>
            <li>
              <CheckCircle size={20} className={styles.checkIcon} />
              Produtos premium importados
            </li>
            <li>
              <CheckCircle size={20} className={styles.checkIcon} />
              Ambiente monitorado e seguro
            </li>
          </ul>

          {/* Botão WhatsApp */}
          <button
            type="button"
            onClick={openWhatsApp}
            className={styles.btnLink}
          >
            Entre em contato conosco <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
