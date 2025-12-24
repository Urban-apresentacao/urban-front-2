import api from "./api";

/**
 * Registra um novo usuário
 * @param {Object} payload - Objeto contendo usu_nome, usu_cpf, etc.
 */
export async function registerUser(payload) {
  // Ajuste a rota '/usuarios' conforme a rota definida no seu backend (ex: /users ou /cadastro)
  const { data } = await api.post("/users", payload);
  return data;
}