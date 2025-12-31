import { useState, useCallback } from "react";
import { getAllServices } from "@/services/services.service";
import Swal from "sweetalert2";

export function useServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estado de Ordenação (Padrão: ID Decrescente)
    const [sortColumn, setSortColumn] = useState("serv_id");
    const [sortDirection, setSortDirection] = useState("DESC");

    const fetchServices = useCallback(async (termo = "", paginaDesejada = 1, status = "all", col = sortColumn, dir = sortDirection) => {
        try {
            setLoading(true);
            
            const response = await getAllServices(termo, paginaDesejada, status, col, dir);
            
            const lista = response.data || [];
            const meta = response.meta || {};

            setServices(lista);
            setTotalPages(meta.totalPages || 1);
            setPage(parseInt(paginaDesejada));
            
        } catch (error) {
            console.error(error);
            Swal.fire("Erro", "Não foi possível carregar os serviços", "error");
        } finally {
            setLoading(false);
        }
    }, [sortColumn, sortDirection]); // Adicionei as dependências aqui

    // Função de Clique no Header da Tabela
    const handleSort = (columnAccessor) => {
        // Ignora colunas que não devem ser ordenadas
        if (!columnAccessor || columnAccessor === 'actions' || columnAccessor === 'cat_serv_nome') return;

        // Inverte a direção se clicar na mesma coluna
        const isAsc = sortColumn === columnAccessor && sortDirection === "ASC";
        const newDirection = isAsc ? "DESC" : "ASC";
        
        setSortColumn(columnAccessor);
        setSortDirection(newDirection);
        // O useEffect na tela vai disparar a busca automaticamente
    };

    return {
        services,
        loading,
        page,
        totalPages,
        fetchServices,
        sortColumn,
        sortDirection,
        handleSort
    };
}