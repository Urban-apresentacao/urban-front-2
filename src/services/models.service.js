import api from "@/services/api";

// Mude o nome da função para ficar claro e aceite os dois parâmetros
export async function getModelsByCategoryAndBrand(categoryId, brandId) {
  // Se faltar algum dos dois, não faz a requisição
  if (!categoryId || !brandId) return [];

  // Chama a rota: GET /models/category/:cat_id/brand/:mar_id
  const { data } = await api.get(`/models/category/${categoryId}/brand/${brandId}`);
  
  return data;
}