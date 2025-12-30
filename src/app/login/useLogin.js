import { useState } from "react";
import { login } from "@/services/auth.service";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export function useLogin() {
  // Adicionei estado de loading para feedback visual no botão
  const [loading, setLoading] = useState(false);

  async function handleLogin(email, senha) {
    setLoading(true); // Começa a carregar

    try {
      const response = await login(email, senha);

      // Se o axios não lançar erro, mas o status vier diferente de success
      if (response.status !== "success") {
        throw new Error("Login inválido");
      }

      const usuario = response.data;
      const userRole = usuario.usu_acesso ? "admin" : "user";

      // 1. SALVAR COOKIES
      Cookies.set("logged", "true", { expires: 1, path: "/" });
      Cookies.set("role", userRole, { expires: 1, path: "/" });

      // 2. SALVAR LOCALSTORAGE
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: usuario.usu_id,
          nome: usuario.usu_nome,
          acesso: usuario.usu_acesso,
        })
      );

      // 3. REDIRECIONAR
      const redirectPath = userRole === "admin" ? "/admin" : "/user";
      window.location.href = redirectPath;

    } catch (error) {
      console.error("ERRO LOGIN:", error);

      // --- TRATAMENTO DE ERRO MELHORADO ---
      
      // 1. Pega a mensagem que veio do Backend (se existir)
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
      
      // 2. Verifica o status do erro
      const status = error.response?.status;

      // 3. Configuração do Alerta
      let title = "Erro no Login";
      let icon = "error";
      let confirmColor = "#d33"; // Vermelho

      // Se for 403, é o erro de USUÁRIO INATIVO (Aviso Amarelo)
      if (status === 403) {
        title = "Acesso Negado";
        icon = "warning";
        confirmColor = "#f59e0b"; // Amarelo/Laranja
      } 
      // Se for 401, é senha incorreta (Aviso Vermelho)
      else if (status === 401) {
        title = "Credenciais Inválidas";
      }

      Swal.fire({
        icon: icon,
        title: title,
        text: msg, // Aqui vai aparecer: "Seu usuário está inativo..."
        confirmButtonColor: confirmColor
      });

    } finally {
      setLoading(false); // Para de carregar (seja sucesso ou erro)
    }
  }

  // Retornamos também o loading
  return { handleLogin, loading };
}