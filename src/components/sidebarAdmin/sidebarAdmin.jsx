"use client"

import { House, Users, Car, Wrench, CalendarCheck, History } from "lucide-react"

import ItemSidebar from "@/components/ui/itemSidebar/itemSidebar"
import styles from "./sidebarAdmin.module.css";

const menuItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: House
    },
    {
        label: "Usuários",
        href: "/admin/users",
        icon: Users
    },
    {
        label: "Veículos",
        href: "/admin/vehicles",
        icon: Car
    },
    {
        label: "Serviços",
        href: "/admin/services",
        icon: Wrench
    },
    {
        label: "Agenda",
        href: "/admin/schedule",
        icon: CalendarCheck
    },
    {
        label: "Histórico",
        href: "/admin/history",
        icon: History
    }
];

export default function SidebarAdmin() {

    return (
        <aside className={styles.sidebar}>
            <nav>
                {menuItems.map((item, index) => (
                    <ItemSidebar
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        href={item.href}
                    />
                ))}
            </nav>
        </aside>
    );
}