import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Confere se a senha bate com a do arquivo .env
    if (password === process.env.ADMIN_PASSWORD) {
      
      const response = NextResponse.json({ success: true });

      // Cria o cookie 'admin_token' que vale por 1 dia (86400 segundos)
      response.cookies.set('admin_token', 'autenticado-com-sucesso', {
        httpOnly: true, // Ninguém mexe via JS
        secure: process.env.NODE_ENV === 'production', // Só HTTPS em produção
        maxAge: 60 * 60 * 24, // 1 dia
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Senha errada, macho!' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro no servidor' }, { status: 500 });
  }
}