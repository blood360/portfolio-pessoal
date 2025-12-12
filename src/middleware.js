import { NextResponse } from 'next/server';

export function middleware(request) {
  // Pega o cookie que diz se o cabra tá logado
  const token = request.cookies.get('admin_token');

  // Se o cara tentar acessar qualquer coisa em /admin...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // ... e NÃO tiver o token, chuta ele pra tela de login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Se tiver tudo ok, deixa passar
  return NextResponse.next();
}

// Configura o segurança pra vigiar só a rota /admin
export const config = {
  matcher: '/admin/:path*',
};