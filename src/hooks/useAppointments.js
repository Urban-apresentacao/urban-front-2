import { useState, useCallback } from "react";
import { getAppointments } from "@/services/appointments.service";

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de Ordenação (Padrão: Data Decrescente)
  const [sortColumn, setSortColumn] = useState("agend_data");
  const [sortDirection, setSortDirection] = useState("DESC");

  // Agora aceita filters, page e ordenação opcional
  const fetchAppointments = useCallback(async (filters = {}, pageNum = 1, col = sortColumn, dir = sortDirection) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        search: filters.search || "",
        date: filters.date || "",
        status: filters.status || "",
        orderBy: col,       
        orderDirection: dir 
      };

      const response = await getAppointments(params);
      
      const data = response.data || []; 
      const meta = response.meta || {};

      setAppointments(data);
      setTotalPages(meta.totalPages || 1);
      setTotalItems(meta.totalItems || 0);
      setPage(pageNum);
      
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  }, [sortColumn, sortDirection]);

  // Função para clicar no cabeçalho
  const handleSort = (columnAccessor) => {
      // Ignora colunas que não devem ordenar (como lista de serviços ou ações)
      if (!columnAccessor || columnAccessor === 'actions' || columnAccessor === 'lista_servicos') return;

      const isAsc = sortColumn === columnAccessor && sortDirection === "ASC";
      const newDirection = isAsc ? "DESC" : "ASC";
      
      setSortColumn(columnAccessor);
      setSortDirection(newDirection);
  };

  return {
    appointments,
    loading,
    fetchAppointments,
    page,
    totalPages,
    totalItems,
    sortColumn,
    sortDirection,
    handleSort
  };
}