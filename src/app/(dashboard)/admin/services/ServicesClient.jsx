"use client";

import { useServices } from "@/hooks/useServices";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Plus, Eye, Search, Trash2, RotateCcw, Filter } from "lucide-react"; 
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import Swal from "sweetalert2";
import { toggleServiceStatus } from "@/services/services.service"; 
import styles from "./ServicesClient.module.css";

export default function ServicesClient() {
  // Desestruturando os dados e funções do Hook, incluindo a Ordenação
  const { 
    services, 
    loading, 
    fetchServices, 
    page, 
    totalPages,
    sortColumn,      // Coluna atual
    sortDirection,   // Direção atual (ASC/DESC)
    handleSort       // Função para trocar a ordem
  } = useServices();
  
  // Estados Locais (Busca e Filtro)
  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); 

  const isMounted = useRef(false);

  // 1. Busca Inicial (Ao carregar a página)
  useEffect(() => {
    // Busca inicial padrão: sem busca, pág 1, todos, ordenado por ID DESC
    fetchServices("", 1, "all", "serv_id", "DESC");
  }, [fetchServices]);

  // 2. Monitoramento de Mudanças (Debounce)
  // Qualquer alteração em Busca, Filtro ou Ordenação dispara isso aqui
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    const delayDebounceFn = setTimeout(() => {
      // Passamos TODOS os parâmetros atuais para manter a consistência
      fetchServices(inputValue, 1, statusFilter, sortColumn, sortDirection);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, statusFilter, sortColumn, sortDirection, fetchServices]); 

  // --- HANDLERS ---

  const handlePageChange = (newPage) => {
    fetchServices(inputValue, newPage, statusFilter, sortColumn, sortDirection);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    // O useEffect acima vai detectar a mudança e buscar automaticamente
  };

  // --- AÇÕES DE STATUS (Lixeira / Restaurar) ---

  const handleArchiveService = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Ocultar Serviço?',
      text: `O serviço "${nome}" ficará inativo e não aparecerá para novos agendamentos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, ocultar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleServiceStatus(id, false); // false = Inativo
        await Swal.fire('Ocultado!', 'Serviço desativado.', 'success');
        // Recarrega a lista mantendo todos os filtros e ordenação atuais
        fetchServices(inputValue, page, statusFilter, sortColumn, sortDirection);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Não foi possível ocultar.', 'error');
      }
    }
  };

  const handleReactivateService = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Reativar Serviço?',
      text: `O serviço "${nome}" voltará a ficar visível no sistema.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, reativar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleServiceStatus(id, true); // true = Ativo
        await Swal.fire('Ativado!', 'Serviço reativado com sucesso.', 'success');
        fetchServices(inputValue, page, statusFilter, sortColumn, sortDirection);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Não foi possível reativar.', 'error');
      }
    }
  };

  // --- DEFINIÇÃO DAS COLUNAS ---
  const columns = [
    { header: "ID", accessor: "serv_id" },
    { header: "Nome", accessor: "serv_nome" },
    { header: "Descrição", accessor: "serv_descricao" },
    {
      header: "Preço",
      accessor: "serv_preco",
      render: (item) => item.serv_preco ? `R$ ${Number(item.serv_preco).toFixed(2)}` : 'R$ 0.00'
    },
    {
      header: "Status",
      accessor: "serv_situacao",
      render: (item) => (
        <span style={{
          backgroundColor: item.serv_situacao ? '#dcfce7' : '#fee2e2',
          color: item.serv_situacao ? '#166534' : '#991b1b',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          border: item.serv_situacao ? '1px solid #bbf7d0' : '1px solid #fecaca'
        }}>
          {item.serv_situacao ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      header: "Ações",
      accessor: "actions",
      render: (service) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href={`/admin/services/${service.serv_id}?mode=view`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
            title="Visualizar"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/services/${service.serv_id}?mode=edit`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
            title="Editar"
          >
            <Edit size={16} />
          </Link>
          
          {/* Lógica do Botão de Status */}
          {service.serv_situacao ? (
            <button
              onClick={() => handleArchiveService(service.serv_id, service.serv_nome)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer'
              }}
              title="Ocultar (Inativar)"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleReactivateService(service.serv_id, service.serv_nome)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer'
              }}
              title="Reativar Serviço"
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
            <div className={styles.searchWrapper}>
                <Search size={20} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Pesquisar serviços..."
                    className={styles.searchInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            <div className={styles.selectWrapper}>
                <Filter size={16} className={styles.filterIcon} />
                <select 
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={handleStatusChange}
                >
                    <option value="all">Status: Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                </select>
            </div>
        </div>

        <Link href="/admin/services/register" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Serviço</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        {/* Passamos as props de ordenação para a Tabela */}
        <Table 
            columns={columns} 
            data={services} 
            isLoading={loading}
            onSort={handleSort}           // Função de clique
            sortColumn={sortColumn}       // Coluna atual
            sortDirection={sortDirection} // Direção atual
        />
      </div>

      {!loading && services.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages} onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}