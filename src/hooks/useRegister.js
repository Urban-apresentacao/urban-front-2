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

      // ✅ SUCESSO
      await Swal.fire({
        title: "Cadastro realizado",
        text: "Usuário cadastrado com sucesso!",
        icon: "success",
        confirmButtonColor: "#16a34a", // verde
        background: "#ffffff",
        color: "#111827"
      });

      router.push("/login");
      return response;

    } catch (error) {
      console.error("Erro no registro:", error);

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        "Não foi possível concluir o cadastro.";

      // 🔒 DUPLICIDADE / REGRA DE NEGÓCIO
      const isBusinessError = status === 409 || status === 400;

      Swal.fire({
        title: isBusinessError
          ? "Não foi possível concluir o cadastro"
          : "Erro inesperado",

        text: message,

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
