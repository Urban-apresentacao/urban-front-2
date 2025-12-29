"use client"

import { House, Users, Car, Wrench, CalendarCheck, History } from "lucide-react"
import ItemSidebar from "@/components/ui/itemSidebar/itemSidebar"
import styles from "./sidebarAdmin.module.css";

// ... (seu array menuItems continua igual aqui) ...
const menuItems = [
    { label: "Dashboard", href: "/admin", icon: House },
    { label: "Usuários", href: "/admin/users", icon: Users },
    { label: "Veículos", href: "/admin/vehicles", icon: Car },
    { label: "Serviços", href: "/admin/services", icon: Wrench },
    { label: "Agendamentos", href: "/admin/appointments", icon: CalendarCheck },
    { label: "Histórico", href: "/admin/history", icon: History }
];

// Recebemos a prop closeMobileMenu
export default function SidebarAdmin({ closeMobileMenu }) {

    return (
        <aside className={styles.sidebar}>
            <nav>
                {menuItems.map((item, index) => (
                    <ItemSidebar
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        href={item.href}
                        // AQUI: Passamos a função para o Item
                        onClick={closeMobileMenu} 
                    />
                ))}
            </nav>
        </aside>
    );
}