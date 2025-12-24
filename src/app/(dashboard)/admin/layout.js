"use client" // Necessário para usar useState

import { useState } from "react";
import Header from "@/components/header/header";
import SidebarAdmin from "@/components/sidebarAdmin/sidebarAdmin";
import styles from "./layout.module.css";

export default function AdminLayout({ children }) {
    // Estado para controlar o menu mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fecha o menu ao clicar no overlay (fundo escuro)
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={styles.container}>
            {/* Passamos a função de toggle para o Header */}
            <Header toggleSidebar={handleToggleSidebar} />

            <div className={styles.body}>
                
                {/* Lado Esquerdo (Sidebar) */}
                {/* Adicionamos uma classe condicional 'open' se o estado for true */}
                <aside className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
                    <SidebarAdmin />
                </aside>

                {/* Overlay: Fundo escuro que aparece apenas no mobile quando menu está aberto */}
                {sidebarOpen && (
                    <div className={styles.overlay} onClick={closeSidebar} />
                )}

                {/* Lado Direito (Conteúdo) */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}