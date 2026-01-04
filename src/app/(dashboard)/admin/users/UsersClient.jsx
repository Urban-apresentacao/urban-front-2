"use client";

import { useUsers } from "@/hooks/useUsers";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Plus, Eye, Search, Trash2, RotateCcw, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import Swal from "sweetalert2";
import { toggleUserStatus } from "@/services/users.service";
import styles from "./UsersClient.module.css";

export default function UsersClient() {
  const {
    users, loading, fetchUsers, page, totalPages,
    sortColumn, sortDirection, handleSort
  } = useUsers();

  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'

  const isMounted = useRef(false);

  // 1. Busca Inicial (Ao abrir a tela)
  useEffect(() => {
    fetchUsers("", 1, "all");
  }, [fetchUsers]);

  // 2. Efeito de Debounce (Busca + Filtro de Status)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchUsers(inputValue, 1, statusFilter, sortColumn, sortDirection);
    }, [inputValue, statusFilter, sortColumn, sortDirection, fetchUsers]);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, statusFilter, fetchUsers]);

  // Função de Paginação
  const handlePageChange = (newPage) => {
    fetchUsers(inputValue, newPage, statusFilter);
  };

  // Função para mudar o Status no Select
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // --- AÇÃO: INATIVAR USUÁRIO ---
  const handleArchiveUser = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Inativar Usuário?',
      text: `O usuário "${nome}" perderá o acesso ao sistema.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, inativar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleUserStatus(id, false); // false = Inativo
        await Swal.fire({
          title: 'Inativado!',
          text: 'Usuário bloqueado.',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });
        fetchUsers(inputValue, page, statusFilter);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Erro ao inativar.', 'error');
      }
    }
  };

  // --- AÇÃO: REATIVAR USUÁRIO ---
  const handleReactivateUser = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Reativar Usuário?',
      text: `O usuário "${nome}" poderá logar novamente.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, reativar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleUserStatus(id, true); // true = Ativo
        await Swal.fire({
          title: 'Ativado!',
          text: 'Acesso restaurado.',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });
        fetchUsers(inputValue, page, statusFilter);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Erro ao reativar.', 'error');
      }
    }
  };

  // --- DEFINIÇÃO DAS COLUNAS ---
  const columns = [
    { header: "ID", accessor: "usu_id" },
    { header: "Nome", accessor: "usu_nome" },
    { header: "Email", accessor: "usu_email" },
    { header: "Telefone", accessor: "usu_telefone" },
    {
      header: "Acesso",
      accessor: "usu_acesso",
      render: (item) => (
        <span style={{
          backgroundColor: item.usu_acesso ? '#dcfce7' : '#dbeafe',
          color: item.usu_acesso ? '#166534' : '#1e40af',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {item.usu_acesso ? "Admin" : "Usuário"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "usu_situacao",
      render: (item) => (
        <span style={{
          backgroundColor: item.usu_situacao ? '#dcfce7' : '#fee2e2',
          color: item.usu_situacao ? '#166534' : '#991b1b',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          border: item.usu_situacao ? '1px solid #e5e7eb' : '1px solid #fecaca'
        }}>
          {item.usu_situacao ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      header: "Ações",
      accessor: "actions",
      render: (user) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href={`/admin/users/${user.usu_id}?mode=view`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
            title="Visualizar"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/users/${user.usu_id}?mode=edit`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
            title="Editar"
          >
            <Edit size={16} />
          </Link>

          {/* Lógica do Botão Status (Lixeira vs Restaurar) */}
          {user.usu_situacao ? (
            <button
              onClick={() => handleArchiveUser(user.usu_id, user.usu_nome)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Inativar Usuário"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleReactivateUser(user.usu_id, user.usu_nome)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Reativar Acesso"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.actionsBar}>

        {/* GRUPO DE FILTROS (Busca + Select) */}
        <div className={styles.filtersGroup}>

          {/* Input de Busca */}
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar usuários..."
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {/* Select de Status */}
          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.filterIcon} />
            <select
              className={styles.statusSelect}
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">Todos</option>
              <option value="active">Apenas Ativos</option>
              <option value="inactive">Apenas Inativos</option>
            </select>
          </div>
        </div>

        {/* Botão Novo Usuário */}
        <Link href="/admin/users/register" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Usuário</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={users}
          isLoading={loading}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </div>

      {!loading && users.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages} onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}