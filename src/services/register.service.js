import api from "./api";

/**
 * Registra um novo usuário
 * @param {Object} payload - Objeto contendo usu_nome, usu_cpf, usu_email, etc.
 */
export async function registerUser(userData) {
    const { data } = await api.post("/users", userData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return data;
}