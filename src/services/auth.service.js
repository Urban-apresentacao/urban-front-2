import api from "@/services/api";

export async function login(email, senha) {
  // ATENÇÃO À URL:
  // Como no login.routes.js está router.post('/') e no app.js está app.use('/auth')
  // A rota final é apenas "/auth"
  const { data } = await api.post("/auth", {
    // Enviando com os nomes que seu controller (que revisamos antes) aceita
    usu_email: email, 
    usu_senha: senha,
    // (Seu controller também aceita 'email' e 'password' se usou minha versão atualizada,
    // mas manter 'usu_' garante compatibilidade com versões antigas)
  });

  return data;
}