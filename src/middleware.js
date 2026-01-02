import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Pega os cookies REAIS que salvamos no useLogin
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value; 

  // --- REGRA 1: Usuário logado tentando acessar /login ---
  // Se ele já tem token, não faz sentido ver a tela de login.
  // Mandamos ele direto para o dashboard correspondente.
  if (pathname === '/login' && token) {
     if (role === 'admin') {
         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
     }
     // Assumindo que o usuário comum vai para /user/dashboard
     return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // --- REGRA 2: Proteção de Rotas Privadas (/admin e /user) ---
  if (pathname.startsWith('/admin') || pathname.startsWith('/user')) {
    
    // a) Se não tem token, tchau -> login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // b) Proteção por Cargo (Role)
    if (pathname.startsWith('/admin') && role !== 'admin') {
      // Se não for admin, manda para o dashboard dele ou para login
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }

    if (pathname.startsWith('/user') && role !== 'user') {
      // Opcional: Impedir admin de ver área de user, ou redirecionar para admin
      // return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configuração das rotas que o middleware deve vigiar
export const config = {
  // Adicionei '/login' aqui para a Regra 1 funcionar
  matcher: ['/admin/:path*', '/user/:path*', '/login'],
};