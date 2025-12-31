import { useState, useCallback } from "react";
import api from "@/services/api";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estado de Ordenação (Padrão: ID Decrescente)
    const [sortColumn, setSortColumn] = useState("usu_id");
    const [sortDirection, setSortDirection] = useState("DESC");

    // fetchUsers agora lê os estados atuais de sort se não forem passados
    const fetchUsers = useCallback(async (search = "", pageNum = 1, status = "all", col = sortColumn, dir = sortDirection) => {
        try {
            setLoading(true);
            const { data } = await api.get("/users", {
                params: { 
                    search, 
                    page: pageNum, 
                    limit: 10, 
                    status,
                    orderBy: col,          // Envia coluna
                    orderDirection: dir    // Envia direção
                } 
            });

            setUsers(data.data);
            setTotalPages(data.meta.totalPages);
            setPage(data.meta.currentPage);
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
        } finally {
            setLoading(false);
        }
    }, [sortColumn, sortDirection]); // Dependências importantes

    // Função para clicar no cabeçalho
    const handleSort = (columnAccessor) => {
        // Se a coluna não for ordenável (ex: Ações), ignora
        if (!columnAccessor || columnAccessor === 'actions') return;

        // Se clicou na mesma coluna, inverte a direção
        const isAsc = sortColumn === columnAccessor && sortDirection === "ASC";
        const newDirection = isAsc ? "DESC" : "ASC";
        
        setSortColumn(columnAccessor);
        setSortDirection(newDirection);

        // Dispara a busca com a nova ordem
        // Precisamos passar os valores atuais de filtro/busca, ou ele resetaria
        // OBS: Idealmente o fetchUsers leria de um estado global de filtro, 
        // mas aqui vamos garantir que ele use os novos valores de sort.
        
        // Dica: O ideal é que o fetchUsers seja chamado pelo useEffect no componente
        // quando sortColumn/sortDirection mudarem. Vamos retornar os setters e valores.
    };

    return { 
        users, 
        loading, 
        fetchUsers, 
        page, 
        totalPages,
        // Novos exports:
        sortColumn,
        sortDirection,
        handleSort 
    };
}