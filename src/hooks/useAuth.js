import Cookies from 'js-cookie';

export function useAuth() {
  
  function logout() {
    // 1. Limpar os cookies corretos
    // ATENÇÃO: Mudamos de 'logged' para 'token'
    Cookies.remove('token', { path: '/' }); 
    Cookies.remove('role', { path: '/' });

    // 2. Limpar dados do localStorage
    // Garanta que está usando a mesma chave que usou no useLogin (ex: 'user' ou 'user_data')
    localStorage.removeItem('user'); 
    localStorage.removeItem('user_data'); // Limpa os dois por garantia
    
    // Opcional
    sessionStorage.clear();

    // 3. Redirecionamento Hard para limpar memória
    window.location.href = '/login';
  }

  return { logout };
}