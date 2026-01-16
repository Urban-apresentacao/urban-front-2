import api from "@/services/api";

export async function getAllCategories() {
  const { data } = await api.get("/categories");

  // SE O BACKEND RETORNA { data: [...] }
  // Adicionamos uma verificação de segurança:
  if (Array.isArray(data)) {
     return data;
  }
  
  // Se data for um objeto que contem uma lista em .data
  return data.data || []; 
}