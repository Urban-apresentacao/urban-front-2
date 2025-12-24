"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { registerUser } from "@/services/register.service.js";
// import { useRouter } from "next/navigation"; // Opcional se quiser redirecionar

export function useRegister() {
  const [loading, setLoading] = useState(false);
  // const router = useRouter(); 

  async function handleRegister(formData) {
    try {
      setLoading(true);

      const response = await registerUser(formData);

      await Swal.fire({
        title: "Sucesso!",
        text: "Usuário cadastrado com sucesso!",
        icon: "success",
        confirmButtonColor: "#ff9d00",
        background: "#3a3a3a",
        color: "#fff"
      });

      // router.push('/login'); // Exemplo de redirect
      return response;
    } catch (error) {
      console.error("Erro no registro:", error);

      const message = error?.response?.data?.message || "Erro ao realizar cadastro.";

      Swal.fire({
        title: "Erro",
        text: message,
        icon: "error",
        confirmButtonColor: "#d33",
        background: "#3a3a3a",
        color: "#fff"
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    handleRegister,
    loading,
  };
}