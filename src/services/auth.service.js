import api from "@/services/api";

export async function login(email, senha) {
  
  const { data } = await api.post("/auth", {
    usu_email: email, 
    usu_senha: senha,
  });

  return data;
}