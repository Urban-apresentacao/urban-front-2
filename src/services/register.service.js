import api from "./api";

/**
 * Registra um novo usuário
 * @param {Object} payload - Objeto contendo usu_nome, usu_cpf, usu_email, etc.
 */
export async function registerUser(payload) {
  try {
    // A rota deve bater com o seu backend (ex: POST http://localhost:3000/users)
    const { data } = await api.post("/users", payload);
    return data;
    
  } catch (error) {
    // 🔍 DEBUG: Isso vai printar no console exatamente o que o Back respondeu (ex: "CPF já existe")
    console.error("Erro no Service de Registro:", error.response?.data);
    
    // IMPORTANTE: O "throw" joga a bomba para o Hook (useRegister), 
    // que é quem vai abrir o SweetAlert. Não remova isso.
    throw error;
  }
}