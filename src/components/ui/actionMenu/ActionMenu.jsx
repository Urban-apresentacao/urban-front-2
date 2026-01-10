"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import styles from "./ActionMenu.module.css";

export const ActionMenu = ({ user, onArchive, onReactivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button 
        className={styles.menuButton} 
        onClick={() => setIsOpen(!isOpen)}
        title="Ações"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link
            href={`/admin/users/${user.usu_id}?mode=view`}
            className={styles.item}
            onClick={() => setIsOpen(false)}
          >
            <Eye size={16} />
            <span>Visualizar</span>
          </Link>
          
          <Link
            href={`/admin/users/${user.usu_id}?mode=edit`}
            className={styles.item}
            onClick={() => setIsOpen(false)}
          >
            <Edit size={16} />
            <span>Editar</span>
          </Link>

          {user.usu_situacao ? (
            <button
              className={`${styles.item} ${styles.danger}`}
              onClick={() => {
                onArchive(user.usu_id, user.usu_nome);
                setIsOpen(false);
              }}
            >
              <Trash2 size={16} />
              <span>Inativar</span>
            </button>
          ) : (
            <button
              className={`${styles.item} ${styles.success}`}
              onClick={() => {
                onReactivate(user.usu_id, user.usu_nome);
                setIsOpen(false);
              }}
            >
              <RotateCcw size={16} />
              <span>Reativar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};