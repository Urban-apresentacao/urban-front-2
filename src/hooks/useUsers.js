import { useState, useCallback } from "react";
import api from "@/services/api"; // seu axios

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // AGORA ACEITA 3 ARGUMENTOS: search, page, status
    const fetchUsers = useCallback(async (search = "", pageNum = 1, status = "all") => {
        try {
            setLoading(true);
            // Passamos o status como param na URL
            const { data } = await api.get("/users", {
                params: { search, page: pageNum, limit: 10, status } 
            });

            setUsers(data.data);
            setTotalPages(data.meta.totalPages);
            setPage(data.meta.currentPage);
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { users, loading, fetchUsers, page, totalPages };
}