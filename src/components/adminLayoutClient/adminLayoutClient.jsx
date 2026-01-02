"use client"

import { useState } from "react";
import HeaderPanelAdmin from "@/components/headerPainelAdmin/headerPanelAdmin";
import SidebarAdmin from "@/components/sidebarAdmin/sidebarAdmin";
import styles from "./layout.module.css";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={styles.container}>
            <HeaderPanelAdmin toggleSidebar={handleToggleSidebar} />

            <div className={styles.body}>
                <aside className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
                    <SidebarAdmin closeMobileMenu={closeSidebar} />
                </aside>

                {sidebarOpen && (
                    <div className={styles.overlay} onClick={closeSidebar} />
                )}

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}