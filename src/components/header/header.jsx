'use client'

import { useAuth } from '@/hooks/useAuth'

import { LogOut } from "lucide-react";
import styles from "./header.module.css";

export default function Header() {

const { logout } = useAuth()

  return (
    <header className={styles.header}>
      <span className={styles.title}>
        Painel Administrativo
      </span>

      <button 
      className={styles.logoutButton}
      onClick={logout}>
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </header>
  );
}
