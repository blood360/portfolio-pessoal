import dbConnect from '@/lib/mongodb';
import Projeto from '@/models/Projeto';
import { NextResponse } from 'next/server';

// GET: Busca TODOS os projetos (pra lista do Admin e da Home)
export async function GET() {
  try {
    await dbConnect();
    // O sort({ dataCriacao: -1 }) faz aparecer o mais novo primeiro
    const projetos = await Projeto.find({}).sort({ dataCriacao: -1 });
    return NextResponse.json({ success: true, data: projetos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST: Cria um projeto NOVO
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const projeto = await Projeto.create(body);
    return NextResponse.json({ success: true, data: projeto }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}