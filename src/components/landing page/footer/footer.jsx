import React from 'react';
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Coluna 1: Sobre */}
        <div className={styles.column}>
          <h3 className={styles.title}>AutoLimp - Loja e Estética Automotiva</h3>
          <p className={styles.text}>
            Especialistas em estética automotiva. Cuidamos do seu carro com excelência e produtos de alta qualidade.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.iconLink}><Instagram size={20} /></a>
            <a href="#" className={styles.iconLink}><Facebook size={20} /></a>
            <a href="#" className={styles.iconLink}><MessageCircle size={20} /></a>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Navegação</h4>
          <ul className={styles.list}>
            <li><a href="#home">Início</a></li>
            <li><a href="#sobre">Sobre Nós</a></li>
            <li><a href="#servicos">Nossos Serviços</a></li>
            {/* <li><a href="#contato">Agendar Visita</a></li> */}
          </ul>
        </div>

        {/* Coluna 3: Contato */}
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Contato</h4>
          <div className={styles.contactItem}>
            <MapPin size={18} className={styles.icon} />
            <span>Residencial Primavera - Rua 4 n° 119 - Herculândia-SP</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={18} className={styles.icon} />
            <span>(00) 99999-9999</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={18} className={styles.icon} />
            <span>contato@autolimp.com</span>
          </div>
        </div>
      </div>
      
      <div className={styles.copy}>
        © {new Date().getFullYear()} AutoLimp. Todos os direitos reservados.
      </div>
    </footer>
  );
}