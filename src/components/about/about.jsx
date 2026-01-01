import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import styles from './about.module.css';

export default function About() {
  return (
    <section id="sobre" className={styles.about}>
      <div className={styles.container}>
        
        {/* Coluna da Imagem */}
        <div className={styles.aboutImage}>
          {/* Futuramente substituir por <Image /> do Next.js */}
          <span>[FOTO DA EQUIPE OU DETALHE]</span>
        </div>

        {/* Coluna do Conteúdo */}
        <div className={styles.aboutContent}>
          <h4 className={styles.tagline}>Sobre a [NOME DA EMPRESA]</h4>
          <h2 className={styles.sectionTitle}>Paixão por detalhes, obsessão por brilho.</h2>

          <p className={styles.text}>
            Fundada com o objetivo de elevar o nível da estética automotiva na região, a <strong>[NOME DA EMPRESA]</strong> nasceu da necessidade de um serviço que tratasse cada veículo como único.
          </p>
          <p className={styles.text}>
            Entendemos que seu carro é uma extensão da sua personalidade e um investimento valioso. Por isso, utilizamos produtos biodegradáveis de tecnologia alemã e equipamentos de precisão para garantir resultados que superam as expectativas.
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

          <button className={styles.btnLink}>
            Saiba mais sobre nós <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}