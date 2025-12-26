"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/register.service.js";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(formData) {
    try {
      setLoading(true);

      const response = await registerUser(formData);

      await Swal.fire({
        title: "Sucesso!",
        text: "Usuário cadastrado com sucesso.",
        icon: "success",
        confirmButtonColor: "#16a34a",
        background: "#ffffff",
        color: "#111827"
      });

      router.push("/login");
      return response;

    } catch (error) {
      // 🔍 DEBUG: Isso vai mostrar no F12 o que está chegando de verdade
      console.log("OBJETO DE ERRO RECEBIDO:", error);
      console.log("RESPONSE DO ERRO:", error.response);

      // Tenta pegar o status e a mensagem de vários lugares possíveis
      const status = error?.response?.status || 500;
      
      // Prioridade da mensagem: 
      // 1. Mensagem vinda do backend (Axios)
      // 2. Mensagem de erro genérica do JS (Error.message)
      // 3. Fallback manual
      const message = 
        error?.response?.data?.message || 
        error?.message || 
        "Ocorreu um erro ao processar sua solicitação.";

      // Se for 400 (Bad Request) ou 409 (Conflict/Duplicado)
      const isBusinessError = status === 409 || status === 400;

      Swal.fire({
        // Título mais amigável
        title: isBusinessError ? "Atenção" : "Erro no Sistema",
        text: message, // Aqui vai aparecer "CPF inválido" ou "Email já existe"
        icon: isBusinessError ? "warning" : "error",
        confirmButtonColor: isBusinessError ? "#f59e0b" : "#dc2626",
        background: "#ffffff",
        color: "#111827"
      });

      throw error;

    } finally {
      setLoading(false);
    }
  }

  return {
    handleRegister,
    loading
  };
}
