"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X, User } from 'lucide-react';
import styles from './header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ MESMA LÓGICA DO FOOTER
  const whatsappNumber = "5518996223545";

  const openWhatsApp = () => {
    const mensagem = "Olá! Gostaria de mais informações sobre os serviços!";
    const mensagemCodificada = encodeURIComponent(mensagem);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const linkZap = isMobile
      ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`;

    window.open(linkZap, "_blank");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <div className={styles.logo}>
          <Image
            src="/images/logo_autolimp.jpeg"
            alt="Logo AutoLimp"
            width={400}
            height={150}
            style={{ width: 'auto', height: '50px', objectFit: 'contain' }}
            priority
          />

          <div className={styles.divider}></div>
          <span className={styles.logoText}>
            AutoLimp - Loja e Estética Automotiva
          </span>
        </div>

        <nav className={styles.desktopNav}>
          <a href="#home" className={styles.navLink}>Serviços</a>
          <a href="#loja" className={styles.navLink}>Produtos</a>
          <a href="#sobre" className={styles.navLink}>Sobre</a>

          <div className={styles.divider}></div>

          <a href="/auth/login" className={styles.loginBtn}>
            <User size={18} /> Entrar
          </a>

          <button
            type="button"
            onClick={openWhatsApp}
            className={`${styles.navLink} ${styles.activeBtn}`}
          >
            Agendar
          </button>
        </nav>

        <button className={styles.mobileBtn} onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className={styles.mobileNav}>
          <a href="#home" onClick={toggleMenu} className={styles.mobileLink}>Serviços</a>
          <a href="#sobre" onClick={toggleMenu} className={styles.mobileLink}>Sobre</a>
          <a href="#loja" onClick={toggleMenu} className={styles.mobileLink}>Produtos</a>

          <hr className={styles.mobileDivider} />

          <a
            href="/auth/login"
            className={`${styles.mobileLink} ${styles.mobileLogin}`}
          >
            <User size={18} /> Área Administrativa
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openWhatsApp();
              toggleMenu();
            }}
            className={`${styles.mobileLink} ${styles.activeBtn} ${styles.mobileSchedule}`}
          >
            Agendar pelo WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
