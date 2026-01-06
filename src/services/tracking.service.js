import api from "./api"; 

// Busca o status do agendamento pelo TOKEN (Público)
export async function getTrackingStatus(token) {
    try {
        // Ajuste a URL base conforme suas rotas. 
        // Se suas rotas de appointment ficam em /appointments, a url final é /appointments/public/status/:token
        const response = await api.get(`/appointments/public/status/${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}