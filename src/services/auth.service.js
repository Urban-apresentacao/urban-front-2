import api from "@/services/api";

export async function login(email, senha) {
  const { data } = await api.post("/login/login", {
    usu_email: email,
    usu_senha: senha,
  });

  return data;
}
