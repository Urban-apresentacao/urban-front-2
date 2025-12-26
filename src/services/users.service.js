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

// ATUALIZAR (PACTH)
export async function updateUser(id, userData) {
  try {
    const { data } = await api.patch(`/users/${id}`, userData);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

// BUSCAR POR ID (GET)
export async function getUserById(id) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}