"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./itemSidebar.module.css";

export default function ItemSidebar({ label, icon: Icon, href }) {
    const pathname = usePathname();

     const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

    return (
        <Link
            href={href}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
        >
            <Icon size={20} className={styles.icon} />
            <span>{label}</span>
        </Link>
    );
}