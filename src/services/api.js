import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Certifique-se que isso está no .env.local
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Antes de enviar, pega o token do cookie e coloca no cabeçalho
api.interceptors.request.use((config) => {
  const token = Cookies.get('token'); // O nome agora é 'token'

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR DE RESPOSTA ---
// Se o token venceu (Erro 401), desloga o usuário automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Evita loop infinito se já estiver no login
        if (!window.location.pathname.includes('/login')) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;