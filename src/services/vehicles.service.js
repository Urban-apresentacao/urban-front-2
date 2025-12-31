import api from "@/services/api";

// LISTAR (com paginação, busca e ordenação)
export async function getAllVehicles(termo = "", page = 1, status = "all", orderBy = "veic_id", orderDirection = "DESC") {
    try {
        const response = await api.get('/vehicles', {
            params: { 
                search: termo,
                page, 
                limit: 10,
                status: status,
                orderBy,
                orderDirection  
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro no service:", error);
        throw error;
    }
}

// CRIAR
export async function createVehicle(vehicleData) {
  const { data } = await api.post("/vehicles", vehicleData);
  return data;
}

// ATUALIZAR
export async function updateVehicle(id, vehicleData) {
  const { data } = await api.patch(`/vehicles/${id}`, vehicleData);
  return data;
}

// BUSCAR POR ID
export async function getVehicleById(id) {
  const { data } = await api.get(`/vehicles/${id}`);
  return data;
}

export async function toggleVehicleStatus(id, status) {
  const { data } = await api.patch(`/vehicles/${id}/status`, { veic_situacao: status });
  return data;
}