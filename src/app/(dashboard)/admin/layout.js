import Header from "@/components/header/header";
import SidebarAdmin from "@/components/sidebarAdmin/sidebarAdmin";

import styles from "./layout.module.css";

export default function AdminLayout({ children }) {
    return (
        <div className={styles.container}>
            {/* 1. Header Fixo no Topo */}
            <Header />

            {/* 2. Área abaixo do Header (Sidebar + Conteúdo) */}
            <div className={styles.body}>
                
                {/* Lado Esquerdo */}
                <aside className={styles.sidebarWrapper}>
                    <SidebarAdmin />
                </aside>

                {/* Lado Direito (Conteúdo dinâmico) */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );

}