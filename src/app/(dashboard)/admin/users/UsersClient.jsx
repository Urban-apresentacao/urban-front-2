"use client";

import { useUsers } from "@/hooks/useUsers";
import { Table } from "@/components/ui/table/table"; 
import Link from "next/link";
import { Edit, Search } from "lucide-react"; 
import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";

import styles from "./UsersClient.module.css"; 

export default function UsersClient() {
  const { users, loading, fetchUsers, page, totalPages } = useUsers();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(inputValue, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchUsers, inputValue]); 

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
            whiteSpace: 'nowrap' /* Impede que quebre linha dentro da badge */
        }}>
          {user.usu_acesso ? "Admin" : "Usuário"}
        </span>
      )
    },
    {
      header: "Ações",
      render: (user) => (
        <Link 
          href={`/admin/users/${user.usu_id}`} 
          style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
        >
          <Edit size={16} /> Editar
        </Link>
      )
    }
  ];

  return (
    <div className={styles.wrapper}>
      
      {/* ÁREA DE PESQUISA */}
      <div className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar usuário..." 
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
      </div>

      {/* ENVOLVENDO A TABELA PARA SCROLL HORIZONTAL */}
      <div className={styles.tableContainer}>
          <Table 
            columns={columns} 
            data={users} 
            isLoading={loading} 
          />
      </div>

      {/* ÁREA DE PAGINAÇÃO */}
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