import api from "@/services/api";

export async function getAllCategoriesVehiclesForServices() {
  const { data } = await api.get("/categories-vehicles-for-services");

  if (Array.isArray(data)) {
     return data;
  }
  
  return data.data || []; 
}