"use client";

import { useUsers } from "@/hooks/useUsers";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Search, Plus, Eye } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";

import styles from "./UsersClient.module.css";

export default function UsersClient() {
  const { users, loading, fetchUsers, page, totalPages } = useUsers();
  const [inputValue, setInputValue] = useState("");

  // Ref para impedir que a busca da digitação rode na montagem inicial
  const isMounted = useRef(false);

  // --- EFEITO 1: Roda APENAS UMA VEZ ao abrir a tela (Mount) ---
  useEffect(() => {
    fetchUsers("", 1);
  }, [fetchUsers]);

  // --- EFEITO 2: Roda APENAS quando o input muda (Update) ---
  useEffect(() => {
    // Se o componente ainda não montou completamente, não faz nada
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Debounce: Espera o usuário parar de digitar
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(inputValue, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, fetchUsers]);

  const handlePageChange = (newPage) => {
    fetchUsers(inputValue, newPage);
  };

  const columns = [
    { header: "ID", accessor: "usu_id" },
    { header: "Nome", accessor: "usu_nome" },
    { header: "Email", accessor: "usu_email" },
    { header: "Telefone", accessor: "usu_telefone" },
    {
      header: "Acesso",
      accessor: "usu_acesso",
      render: (user) => (
        <span style={{
          backgroundColor: user.usu_acesso ? '#dcfce7' : '#dbeafe',
          color: user.usu_acesso ? '#166534' : '#1e40af',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}>
          {user.usu_acesso ? "Admin" : "Usuário"}
        </span>
      )
    },
    {
      header: "Ações",
      render: (user) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href={`/admin/users/${user.usu_id}?mode=edit`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
          >
            <Edit size={16} /> Editar
          </Link>
          <Link
            href={`/admin/users/${user.usu_id}?mode=view`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
          >
            <Eye size={16} /> Visualizar
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className={styles.wrapper}>

      <div className={styles.actionsBar}>
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar usuário..."
            className={styles.searchInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <Link href="/admin/users/register" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={users}
          isLoading={loading}
        />
      </div>

      {!loading && users.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}