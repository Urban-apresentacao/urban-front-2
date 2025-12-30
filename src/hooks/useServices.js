import { useState, useCallback } from "react";
import { getAllServices } from "@/services/services.service";
import Swal from "sweetalert2";

export function useServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchServices = useCallback(async (termo = "", paginaDesejada = 1, status = "all") => {
        try {
            setLoading(true);
            
            const response = await getAllServices(termo, paginaDesejada, status);
            
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
    }, []);

    return {
        services,
        loading,
        page,
        totalPages,
        fetchServices
    };
}