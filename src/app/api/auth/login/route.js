import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Pra garantir que não cacheia

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    // --- ÁREA DE INVESTIGAÇÃO (O X-9) ---
    console.log("=== TENTATIVA DE LOGIN ===");
    console.log("Senha que chegou do front:", password);
    console.log("Senha que tá na Vercel (ENV):", process.env.ADMIN_PASSWORD);
    
    // Verificando se tem espaços em branco atrapalhando
    if (process.env.ADMIN_PASSWORD) {
        console.log("Tamanho da senha no ENV:", process.env.ADMIN_PASSWORD.length);
    } else {
        console.log("ERRO: A variável ADMIN_PASSWORD não foi encontrada!");
    }
    // ------------------------------------

    // Confere se a senha bate com a do arquivo .env
    // O trim() remove espaços vazios antes e depois, pra garantir
    if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD.trim()) {
      
      const response = NextResponse.json({ success: true });

      // Cria o cookie 'admin_token'
      response.cookies.set('admin_token', 'autenticado-com-sucesso', {
        httpOnly: true,
        secure: true, // Na Vercel é sempre HTTPS
        maxAge: 60 * 60 * 24, 
        path: '/',
      });

      return response;
    }

    console.log("Falha: As senhas não bateram.");
    return NextResponse.json({ success: false, message: 'Senha errada, macho!' }, { status: 401 });

  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json({ success: false, message: 'Erro no servidor' }, { status: 500 });
  }
}