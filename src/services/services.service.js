import api from "./api";

export const getAllServices = async (search = "", page = 1, status = "all", orderBy = "serv_id", orderDirection = "DESC") => {
    try {
        const response = await api.get('/services', {
            params: { 
                search,
                page,
                limit: 10,
                status,
                orderBy,
                orderDirection
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        throw error;
    }
};

export async function getServicesList() {
    // Pedimos um limite alto (ex: 100) para trazer todos de uma vez
    const { data } = await api.get("/services", { 
        params: { limit: 100 } 
    });
    
    // O backend retorna { status: 'success', data: [...], meta: ... }
    // Queremos retornar apenas o array que está em data.data
    return data.data; 
}

export async function getServiceById(id) {
    const { data } = await api.get(`/services/${id}`);
    return data;
}

export async function createService(payload) {
    const { data } = await api.post("/services", payload);
    return data;
}

export async function updateService(id, payload) {
    const { data } = await api.put(`/services/${id}`, payload);
    return data;
}

export async function toggleServiceStatus(id, status) {
    // Chama a rota PATCH enviando apenas o objeto { serv_situacao: true/false }
    const { data } = await api.patch(`/services/${id}/status`, { serv_situacao: status });
    return data;
}

export async function deleteService(id) {
    const { data } = await api.delete(`/services/${id}`);
    return data;
}