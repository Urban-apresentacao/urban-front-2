import api from "@/services/api";

// LISTAR (com paginação e busca)
export async function getAllVehicles(termo = "", page = 1) {
  const { data } = await api.get("/vehicles", {
    params: {
      search: termo,
      page: page,
      limit: 10
    }
  });
  return data;
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