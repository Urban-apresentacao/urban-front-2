import api from "@/services/api";

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