import { useState, useCallback } from "react";
import { getAppointments } from "@/services/appointments.service";

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Agora aceita um objeto filters: { search, date, status }
  const fetchAppointments = useCallback(async (filters = {}, pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        search: filters.search || "",
        date: filters.date || "",     // Novo
        status: filters.status || ""  // Novo
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
  }, []);

  return {
    appointments,
    loading,
    fetchAppointments,
    page,
    totalPages,
    totalItems
  };
}