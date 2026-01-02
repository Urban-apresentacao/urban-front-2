"use client"

import { 
  House, 
  Car, 
  CalendarPlus, // Ícone para "Novo Agendamento"
  CalendarCheck, // Ícone para "Meus Agendamentos"
  User, // Ícone para Perfil
  History // Ícone para Histórico (opcional, mas útil)
} from "lucide-react"

import ItemSidebar from "@/components/ui/itemSidebar/itemSidebar"
// Você pode criar um sidebarUser.module.css ou renomear o do admin para sidebar.module.css se forem iguais
import styles from "./sidebarUser.module.css"; 

const menuItems = [
    { 
        label: "Início", 
        href: "/user", 
        icon: House 
    },
    { 
        label: "Meus Veículos", 
        href: "/user/vehicles", 
        icon: Car 
    },
    { 
        label: "Novo Agendamento", 
        href: "/user/schedule/new", 
        icon: CalendarPlus 
    },
    { 
        label: "Meus Agendamentos", 
        href: "/user/appointments", 
        icon: CalendarCheck 
    },
    { 
        label: "Histórico de Serviços", 
        href: "/user/history", 
        icon: History 
    },
    { 
        label: "Minha Conta", 
        href: "/user/profile", 
        icon: User 
    }
];

export default function SidebarUser({ closeMobileMenu }) {

    return (
        <aside className={styles.sidebar}>
            <nav>
                {menuItems.map((item, index) => (
                    <ItemSidebar
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        href={item.href}
                        onClick={closeMobileMenu} 
                    />
                ))}
            </nav>
        </aside>
    );
}