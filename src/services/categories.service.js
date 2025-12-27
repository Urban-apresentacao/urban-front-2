import api from "@/services/api";

export async function getAllCategories() {
  const { data } = await api.get("/categories")

  return data;
}