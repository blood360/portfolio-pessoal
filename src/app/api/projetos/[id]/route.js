import dbConnect from '@/lib/mongodb';
import Projeto from '@/models/Projeto';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params; 

    if (!id || id.length !== 24) {
        return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 });
    }

    const projeto = await Projeto.findById(id);

    if (!projeto) {
      return NextResponse.json({ success: false, error: 'Projeto não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: projeto });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json(); 

    if (!id || id.length !== 24) {
        return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 });
    }

    const projetoAtualizado = await Projeto.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!projetoAtualizado) {
      return NextResponse.json({ success: false, error: 'Projeto não encontrado para editar' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: projetoAtualizado });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id || id.length !== 24) {
        return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 });
    }

    const projetoApagado = await Projeto.findByIdAndDelete(id);

    if (!projetoApagado) {
      return NextResponse.json({ success: false, error: 'Projeto não encontrado para deletar' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}