"use client";

import { useState, useEffect, useCallback } from "react";
// Importar COM CHAVES do seu service
import { getMyProfile, updateMyProfile } from "@/services/profile.service"; 
import Swal from "sweetalert2";

export function useProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Vai chamar o service que lê o localStorage
      const userData = await getMyProfile();
      setUser(userData);
    } catch (error) {
      console.error("Erro no hook:", error);
      Swal.fire({
        icon: "error",
        title: "Sessão Expirada",
        text: "Não conseguimos carregar seus dados. Faça login novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleUpdate(formData) {
    try {
      await updateMyProfile(formData);
      
      Swal.fire({
        icon: "success",
        title: "Atualizado!",
        text: "Seus dados foram salvos com sucesso.",
        timer: 1500,
        showConfirmButton: false
      });

      await fetchProfile(); // Recarrega os dados para garantir
      return true;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao salvar.";
      Swal.fire({ icon: "error", title: "Erro", text: msg });
      return false;
    }
  }

  return { user, loading, handleUpdate };
}