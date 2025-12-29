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

// Lista simplificada para o Select de Clientes
export async function getUsersList() {
    const { data } = await api.get("/users?limit=1000"); // Traz todos para o select (ideal seria um select async)
    return data.data; 
}

// Busca veículos de um usuário específico
export async function getUserVehicles(userId) {
    const { data } = await api.get(`/users/${userId}/vehicles`);
    return data;
}