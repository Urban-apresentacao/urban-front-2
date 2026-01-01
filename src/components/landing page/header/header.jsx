"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X, Car, User } from 'lucide-react'; // Importei o ícone de User (opcional)
import styles from './header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo Area */}
        <div className={styles.logo}>

          <Image
            src="/images/logo_autolimp.jpeg"
            alt="Logo AutoLimp"
            width={400}  // Reduzi de 180 para 150 (ajuste conforme a proporção real)
            height={150}  // Mantive 50 (ajuste conforme a proporção real)
            style={{
              width: 'auto',   /* Largura se adapta */
              height: '50px',  /* Altura fixa segura (menor que o header de 80px) */
              objectFit: 'contain'
            }}
            quality={100}
            className={styles.logoImage}
            priority
          />

          <span className={styles.logoText}>AutoLimp - Loja e Estética Automotiva</span>
        </div>

        {/* Desktop Navbar */}
        <nav className={styles.desktopNav}>
          <a href="#home" className={styles.navLink}>Início</a>
          <a href="#sobre" className={styles.navLink}>Sobre</a>
          <a href="#servicos" className={styles.navLink}>Serviços</a>

          {/* Divisor visual opcional */}
          <div className={styles.divider}></div>

          {/* Botão de Login */}
          <a href="/login" className={styles.loginBtn}>
            <User size={18} /> Entrar
          </a>

          <a href="#contato" className={`${styles.navLink} ${styles.activeBtn}`}>Agendar</a>
        </nav>

        {/* Mobile Hamburger */}
        <button className={styles.mobileBtn} onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <nav className={styles.mobileNav}>
          <a href="#home" onClick={toggleMenu} className={styles.mobileLink}>Início</a>
          <a href="#sobre" onClick={toggleMenu} className={styles.mobileLink}>Sobre</a>
          <a href="#servicos" onClick={toggleMenu} className={styles.mobileLink}>Serviços</a>

          <hr className={styles.mobileDivider} />

          {/* Login no Mobile */}
          <a href="/login" className={`${styles.mobileLink} ${styles.mobileLogin}`}>
            <User size={18} /> Área do Cliente
          </a>

          <a href="#contato" onClick={toggleMenu} className={styles.mobileLink}>Agendar</a>
        </nav>
      )}
    </header>
  );
}