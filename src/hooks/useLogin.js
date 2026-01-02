import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa o roteador do Next
import { login } from "@/services/auth.service";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Instancia o roteador

  async function handleLogin(email, senha) {
    setLoading(true);

    try {
      // O service retorna o corpo da resposta (response.data do axios)
      const response = await login(email, senha);

      // Verificação de segurança
      if (response.status !== "success" || !response.token) {
        throw new Error("Erro no processamento do login.");
      }

      // Desestrutura o retorno do Backend
      const { token, data: usuario } = response;
      const userRole = usuario.usu_acesso ? "admin" : "user";

      // 1. LIMPEZA (Remove lixo antigo se houver)
      Cookies.remove("logged");

      // 2. SALVAR COOKIES CORRETOS (Essencial para o api.js e middleware)
      Cookies.set("token", token, { expires: 1, path: "/" }); // O api.js lê este aqui!
      Cookies.set("role", userRole, { expires: 1, path: "/" });

      // 3. SALVAR LOCALSTORAGE
      // Salva o objeto do usuário (o backend já tirou a senha)
      localStorage.setItem("user", JSON.stringify(usuario));

      // Feedback visual rápido
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: `Bem-vindo, ${usuario.usu_nome}!`
      });

      // 4. REDIRECIONAR
      // Use router.push para uma transição suave (SPA)
      if (userRole === "admin") {
        router.push("/admin"); // Ajuste conforme sua rota real
      } else {
        router.push("/user");
      }

    } catch (error) {
      console.error("ERRO LOGIN:", error);

      // --- TRATAMENTO DE ERRO ---
      
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
      const status = error.response?.status;

      let title = "Erro no Login";
      let icon = "error";
      let confirmColor = "#d33";

      // Tratamento específico para Usuário Inativo (Configuramos isso no Backend)
      if (status === 403) {
        title = "Acesso Negado";
        icon = "warning";
        confirmColor = "#f59e0b"; // Laranja
      } 
      else if (status === 401) {
        title = "Credenciais Inválidas";
      }

      Swal.fire({
        icon: icon,
        title: title,
        text: msg,
        confirmButtonColor: confirmColor
      });

    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading };
}