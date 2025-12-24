"use client";

import { useState, useEffect } from "react";

import Swal from "sweetalert2";

import { getAllUsers } from "@/services/users.service";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchUsers() {
        try {
            setLoading(true);

            const response = await getAllUsers();
 
            setUsers(response.data || response);
 
              console.log("USERS DA API:", response); // 👈 DEBUG IMPORTANTE
        } catch (error) {
            console.error("Erro ao buscar os usuários:", error);
            Swal.fire("Erro", "Não foi possível carregar os usuários.", "error");
        } finally {
            setLoading(false);
        }
    }

    // O array vazio [] garante que execute apenas 1 vez quando a tela abrir
    useEffect(() => {
        fetchUsers();
    }, []);

    return {users, loading};
}