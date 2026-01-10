import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  async function handleLogin(email, senha) {
    setLoading(true);

    try {
      // O service retorna o corpo da resposta (response.data do axios)
      const response = await login(email, senha);

      if (response.status !== "success" || !response.token) {
        throw new Error("Erro no processamento do login.");
      }

      const { token, data: usuario } = response;
      const userRole = usuario.usu_acesso ? "admin" : "user";

      // 1. LIMPEZA (Remove lixo antigo se houver)
      Cookies.remove("logged");

      // 2. SALVAR COOKIES CORRETOS (Essencial para o api.js e middleware)
      Cookies.set("token", token, { expires: 1, path: "/" }); 
      Cookies.set("role", userRole, { expires: 1, path: "/" });

      // 3. SALVAR LOCALSTORAGE
      // Salva o objeto do usuário (o backend já tirou a senha)
      localStorage.setItem("user", JSON.stringify(usuario));

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
        router.push("/admin"); 
      } else {
        router.push("/user");
      }

    } catch (error) {
      
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";

      // --- TRATAMENTO LIMPO ---
      // Se for 401 (Senha errada) ou 403 (Inativo), avisamos o usuário e paramos o código.
      if (status === 401 || status === 403) {
          
          let title = "Credenciais Inválidas";
          let icon = "error";
          let confirmColor = "#d33";

          if (status === 403) {
            title = "Acesso Negado";
            icon = "warning";
            confirmColor = "#f59e0b"; 
          }

          Swal.fire({
            icon: icon,
            title: title,
            text: msg,
            confirmButtonColor: confirmColor
          });
          
          return;
      }

      // --- ERROS CRÍTICOS (Esses a gente quer ver no console) ---
      console.error("ERRO CRÍTICO LOGIN:", error);

      Swal.fire({
        icon: "error",
        title: "Erro no Servidor",
        text: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        confirmButtonColor: "#d33"
      });

    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading };
}