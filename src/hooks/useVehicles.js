"use client";

import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import Swal from "sweetalert2";
import { getAllVehicles } from "@/services/vehicles.service";

export function useVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados da paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 👇 IMPORTANTE: Envolvemos em useCallback para a função não ser recriada a cada render
    const fetchVehicles = useCallback(async (termo = "", paginaDesejada = 1) => {
        try {
            setLoading(true);   
            
            // Chama o service passando termo e página
            const response = await getAllVehicles(termo, paginaDesejada);

            // Ajuste conforme o retorno real do seu backend (ex: response.data ou response)
            const lista = response.data || [];
            const meta = response.meta || {};

            setVehicles(lista);
            
            // Atualiza estados de paginação (com fallbacks de segurança)
            setTotalPages(meta.totalPages || 1);
            setPage(parseInt(paginaDesejada));

        } catch (error) {
            console.error("Erro ao buscar os veículos:", error);
            Swal.fire("Erro", "Não foi possível carregar os veículos.", "error");
        } finally {
            setLoading(false);
        }   
    }, []); // Dependências vazias

    // Carrega a primeira vez
    // useEffect(() => {
    //     fetchVehicles(); 
    // }, [fetchVehicles]);     

    // Retorna tudo que o componente precisa
    return { vehicles, loading, fetchVehicles, page, totalPages };
}