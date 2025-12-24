"use client";

import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import Swal from "sweetalert2";
import { getAllUsers } from "@/services/users.service"; 

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados da paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 👇 IMPORTANTE: Envolvemos em useCallback para a função não ser recriada a cada render
    // Isso impede que o useEffect do seu componente entre em loop infinito
    const fetchUsers = useCallback(async (termo = "", paginaDesejada = 1) => {
        try {
            setLoading(true);

            // Chama o service passando termo e página
            const response = await getAllUsers(termo, paginaDesejada); 

            // Ajuste conforme o retorno real do seu backend (ex: response.data ou response)
            // Se o backend retornar { data: [...], meta: { totalPages: 10, ... } }
            const lista = response.data || [];
            const meta = response.meta || {};

            setUsers(lista);
            
            // Atualiza estados de paginação (com fallbacks de segurança)
            setTotalPages(meta.totalPages || 1);
            setPage(parseInt(paginaDesejada));
            
        } catch (error) {
            console.error("Erro ao buscar os usuários:", error);
            Swal.fire("Erro", "Não foi possível carregar os usuários.", "error");
        } finally {
            setLoading(false);
        }
    }, []); // Dependências vazias (a função não depende de nada externo que mude)

    // Carrega a primeira vez
    useEffect(() => {
        fetchUsers(); 
    }, [fetchUsers]);

    // Retorna tudo que o componente precisa
    return { users, loading, fetchUsers, page, totalPages };
}