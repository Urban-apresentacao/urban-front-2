import api from "./api";

// Endpoint sugerido: /service-categories (ou o que estiver no seu back)
export async function getServiceCategories() {
    // Ajuste a rota conforme seu backend define (ex: /categorias_servicos)
    const { data } = await api.get("/service-categories");
    return data;
}

export async function createServiceCategory(payload) {
    const { data } = await api.post("/service-categories", payload);
    return data;
}

export async function updateServiceCategory(id, payload) {
    const { data } = await api.put(`/service-categories/${id}`, payload);
    return data;
}