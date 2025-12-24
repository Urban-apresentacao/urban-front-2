"use client";

import { useUsers } from "@/hooks/useUsers";
import { Table } from "@/components/ui/table/table"; 
import Link from "next/link";
import { Edit, Search } from "lucide-react"; 
import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination/pagination"; // Certifique-se do caminho correto

import styles from "./UsersClient.module.css"; 

export default function UsersClient() {
  // 👇 CORREÇÃO: Pegando page e totalPages do hook
  const { users, loading, fetchUsers, page, totalPages } = useUsers();

  const [inputValue, setInputValue] = useState("");

  // --- LÓGICA DE BUSCA AUTOMÁTICA (DEBOUNCE) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Busca o termo na página 1 sempre que digitar
      fetchUsers(inputValue, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    
  }, [fetchUsers, inputValue]); 

  // Função para mudar de página (Clicar na setinha)
  const handlePageChange = (newPage) => {
    // Mantém o termo de busca atual e muda só a página
    fetchUsers(inputValue, newPage);
  };

  // Definição das Colunas
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
            fontWeight: 'bold'
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

      <Table 
        columns={columns} 
        data={users} 
        isLoading={loading} 
      />

      {/* ÁREA DE PAGINAÇÃO */}
      {/* Só mostra se não estiver carregando e tiver usuários */}
      {!loading && users.length > 0 && (
         <Pagination 
            currentPage={page}        // Passa a página atual
            totalPages={totalPages}   // Passa o total de páginas
            onPageChange={handlePageChange} // Função de troca
         />
       )}
    </div>
  );
}