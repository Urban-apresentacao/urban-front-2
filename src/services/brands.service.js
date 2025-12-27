import api from "@/services/api";

// Função para buscar marcas filtradas pela categoria
export async function getBrandsByCategoryId(categoryId) {
  // Se não tiver ID, retorna array vazio para evitar chamadas desnecessárias
  if (!categoryId) return [];

  // Chama a rota: GET /brands/category/:cat_id
  const { data } = await api.get(`/brands/category/${categoryId}`);
  
  return data;
}