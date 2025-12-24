import api from "@/services/api";

    // O parâmetro termo chega aqui
    export async function getAllUsers(termo = "", page = 1) {
  // E é enviado na URL como ?search=termo
  const { data } = await api.get("/users", {
    params: {
      search: termo,
      page: page,
      limit: 10 // Opcional, se o back tiver valor padrão
    }
  });
  return data;
}