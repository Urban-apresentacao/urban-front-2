import api from "./api"; 

function getLoggedUserId() {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  
  // --- DEBUG ---
  console.log("1. Buscando 'user' no LocalStorage:", userStr); 
  // -------------

  if (!userStr) {
      console.error("ERRO: LocalStorage vazio ou chave 'user' não existe.");
      return null;
  }

  try {
      const userObj = JSON.parse(userStr);
      
      // --- DEBUG ---
      console.log("2. Objeto parseado:", userObj);
      console.log("3. Tentando acessar usu_id:", userObj.usu_id);
      // -------------

      return userObj.usu_id;
  } catch (e) {
      console.error("ERRO: Falha ao fazer JSON.parse do usuário", e);
      return null;
  }
}

export const getMyProfile = async () => {
  console.log("4. Iniciando getMyProfile...");
  
  const id = getLoggedUserId();
  
  if (!id) {
      console.error("ERRO: ID não encontrado, abortando requisição.");
      throw new Error("ID não encontrado");
  }

  console.log(`5. Enviando requisição GET para: /users/${id}`);

  try {
      const response = await api.get(`/users/${id}`);
      console.log("6. Resposta do Backend:", response.data);
      return response.data.data;
  } catch (error) {
      console.error("ERRO NA API:", error);
      throw error;
  }
};

export const updateMyProfile = async (data) => {
  const id = getLoggedUserId();
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};