"use client"

import { useAuth } from '@/hooks/useAuth'
import { LogOut, Menu } from "lucide-react"; // Importar Menu
import styles from "./headerPanelUser.module.css";

// Recebe a função toggleSidebar via props
export default function HeaderPanelUser({ toggleSidebar }) {    
    const { logout } = useAuth()
    return (
        <header className={styles.header}>
            <div className={styles.leftSide}>
                {/* Botão Hamburger (visível apenas no mobile via CSS) */}
                <button 
                    className={styles.menuButton}
                    onClick={toggleSidebar}
                >
                    <Menu size={24} />
                </button>   
                <span className={styles.title}>
                    Painel do Usuário
                </span>
            </div>
            <button
                className={styles.logoutButton}
                onClick={logout}>
                <LogOut size={20} />    
                <span className={styles.logoutText}>Sair</span>
            </button>
        </header>
    );
}