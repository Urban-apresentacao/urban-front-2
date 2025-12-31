"use client";

import { useAppointments } from "@/hooks/useAppointments";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
// Adicionei Calendar e Plus aos imports
import { Edit, Eye, Search, Ban, Calendar, Filter, Plus } from "lucide-react"; 
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import Swal from "sweetalert2";
import { cancelAppointment } from "@/services/appointments.service";
import styles from "./AppointmentsClient.module.css";

const STATUS_MAP = {
  1: { label: "Pendente", color: "#f59e0b", bg: "#fef3c7" },    
  2: { label: "Em Andamento", color: "#3b82f6", bg: "#dbeafe" }, 
  3: { label: "Concluído", color: "#16a34a", bg: "#dcfce7" },    
  0: { label: "Cancelado", color: "#ef4444", bg: "#fee2e2" },    
};

export default function AppointmentsClient() {
  const { 
    appointments, loading, fetchAppointments, page, totalPages,
    sortColumn, sortDirection, handleSort
  } = useAppointments();
  
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    status: ""
  });

  const isMounted = useRef(false);

  useEffect(() => {
    fetchAppointments(filters, 1, "agend_data", "DESC");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAppointments]); 

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchAppointments(filters, 1, sortColumn, sortDirection);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.search, filters.date, filters.status, sortColumn, sortDirection, fetchAppointments]);

  const handlePageChange = (newPage) => {
    fetchAppointments(filters, newPage, sortColumn, sortDirection);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = async (id, cliente) => {
    const result = await Swal.fire({
      title: 'Cancelar Agendamento?',
      text: `Deseja cancelar o agendamento de ${cliente}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Voltar'
    });

    if (result.isConfirmed) {
      try {
        await cancelAppointment(id);
        await Swal.fire('Cancelado!', 'O agendamento foi cancelado.', 'success');
        fetchAppointments(filters, page, sortColumn, sortDirection);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Não foi possível cancelar.', 'error');
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "agend_id" },
    { 
      header: "Placa", 
      accessor: "veic_placa",
      render: (item) => (
        <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            {item.veic_placa}
        </span>
      )
    },
    { 
      header: "Data", 
      accessor: "agend_data", 
      render: (item) => new Date(item.agend_data).toLocaleDateString('pt-BR')
    },
    { 
      header: "Horário", 
      accessor: "agend_horario",
      render: (item) => item.agend_horario ? item.agend_horario.substring(0, 5) : '--:--'
    },
    { 
      header: "Serviço(s)", 
      accessor: "lista_servicos", 
      render: (item) => {
          const servicos = item.lista_servicos || "Nenhum";
          return (
            <span title={servicos} style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {servicos}
            </span>
          );
      }
    },
    { header: "Cliente", accessor: "usu_nome" },
    {
      header: "Status",
      accessor: "agend_situacao",
      render: (item) => {
        const status = STATUS_MAP[item.agend_situacao] || { label: "Desconhecido", color: "#666", bg: "#eee" };
        return (
          <span style={{
            backgroundColor: status.bg,
            color: status.color,
            padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap'
          }}>
            {status.label}
          </span>
        );
      },
    },
    {
      header: "Ações",
      accessor: "actions",
      render: (item) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href={`/admin/appointments/${item.agend_id}?mode=view`} title="Visualizar" style={{ color: '#2563eb' }}>
            <Eye size={18} />
          </Link>
          
          {item.agend_situacao !== 0 && (
            <>
              <Link href={`/admin/appointments/${item.agend_id}?mode=edit`} title="Editar" style={{ color: '#2563eb' }}>
                <Edit size={18} />
              </Link>
              <button onClick={() => handleCancel(item.agend_id, item.usu_nome)} title="Cancelar" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Ban size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.actionsBar}>
        
        {/* GRUPO DE FILTROS (Busca + Selects) */}
        <div className={styles.filtersGroup}>
            
            {/* 1. Busca Texto */}
            <div className={styles.searchWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input
                name="search"
                type="text"
                placeholder="Buscar cliente ou placa..."
                className={styles.searchInput}
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            {/* 2. Filtro Status (Agora colado na busca) */}
            <div className={styles.selectWrapper}>
                <Filter size={16} className={styles.filterIcon} />
                <select 
                    name="status" 
                    className={styles.filterSelect}
                    value={filters.status}
                    onChange={handleFilterChange}
                >
                    <option value="">Todos</option>
                    <option value="1">Pendente</option>
                    <option value="2">Em Andamento</option>
                    <option value="3">Concluído</option>
                    <option value="0">Cancelado</option>
                </select>
            </div>

            {/* 3. Filtro Data (Logo após status) */}
            <div className={styles.dateWrapper}>
                <Calendar size={16} className={styles.filterIcon} />
                <input 
                    name="date"
                    type="date" 
                    className={styles.filterInput}
                    value={filters.date}
                    onChange={handleFilterChange}
                    title="Filtrar por data"
                />
            </div>

        </div>

        {/* BOTÃO DE NOVO AGENDAMENTO (Direita) */}
        <Link href="/admin/schedule" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Agendamento</span>
        </Link>

      </div>

      <div className={styles.tableContainer}>
        <Table columns={columns} data={appointments} isLoading={loading} onSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
      </div>

      {!loading && appointments.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}