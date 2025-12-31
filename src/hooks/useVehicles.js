"use client";

import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { getAllVehicles } from "@/services/vehicles.service";

export function useVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [sortColumn, setSortColumn] = useState("veic_id");
    const [sortDirection, setSortDirection] = useState("DESC");

    const fetchVehicles = useCallback(
        async (termo, paginaDesejada, status, col, dir) => {
            try {
                setLoading(true);
                const response = await getAllVehicles(
                    termo, 
                    paginaDesejada, 
                    status, 
                    col, 
                    dir
                );

                setVehicles(response.data || []);
                setTotalPages(response.meta?.totalPages || 1);
                setPage(Number(paginaDesejada));
            } catch (error) {
                console.error(error);
                Swal.fire("Erro", "Não foi possível carregar os veículos.", "error");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleSort = (columnAccessor) => {
        if (!columnAccessor || columnAccessor === 'actions' || columnAccessor === 'proprietarios') return;
        const isAsc = sortColumn === columnAccessor && sortDirection === "ASC";
        setSortColumn(columnAccessor);
        setSortDirection(isAsc ? "DESC" : "ASC");
    };

    return { 
        vehicles, loading, fetchVehicles, page, totalPages,
        sortColumn, sortDirection, handleSort
    };
}