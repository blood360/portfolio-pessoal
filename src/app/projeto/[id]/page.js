"use client";

import { useState, useEffect } from 'react';
// 1. Adicionei o usePathname aqui nas importações
import { useParams, useRouter, usePathname } from 'next/navigation'; 
import { Github, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProjetoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname(); // 2. Inicializei o cabra aqui
  
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifico se a URL atual começa com /admin
  const ehAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    async function fetchProjeto() {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/projetos/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProjeto(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjeto();
  }, [params.id]);

  const handleDelete = async () => {
    // ... (sua função handleDelete continua a mesma, sem mexer em nada)
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Se apagar esse projeto, não tem volta!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, delete logo!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/projetos/${params.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (data.success) {
          await Swal.fire('Apagado!', 'O projeto foi pro espaço.', 'success');
          router.push(ehAdmin ? '/admin' : '/#projetos'); // Redireciona conforme quem apagou
        } else {
          Swal.fire('Erro!', 'Não consegui apagar.', 'error');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Erro!', 'Erro de conexão com o servidor.', 'error');
      }
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '5rem' }}>Carregando detalhes...</div>;
  if (!projeto) return <div style={{ color: 'white', textAlign: 'center', padding: '5rem' }}>Projeto não encontrado, macho!</div>;

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <a href={ehAdmin ? "/admin" : "/#projetos"} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#999', textDecoration: 'none' }}>
          <ArrowLeft size={20} /> Voltar {ehAdmin ? 'para o Painel' : 'para Home'}
        </a>

        {/* 3. A MÁGICA ACONTECE AQUI: O botão só renderiza se for Admin */}
        {ehAdmin && (
          <button onClick={handleDelete} style={btnStyleDanger}>
              <Trash2 size={18} /> Apagar Projeto
          </button>
        )}
      </div>

      <h1 style={{ fontSize: '3rem', color: '#ccff00', marginBottom: '1rem', lineHeight: '1.1' }}>{projeto.titulo}</h1>

      {/* ... resto do seu código (tecnologias, imagem, descrição...) */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {projeto.tecnologias.map((tech, index) => (
          <span key={index} style={{ background: '#222', padding: '5px 15px', borderRadius: '20px', color: '#ccff00', border: '1px solid #333' }}>
            {tech}
          </span>
        ))}
      </div>

      <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', borderRadius: '15px', border: '1px solid #333', marginBottom: '2rem' }}>
        {projeto.imagemUrl ? (
          <img src={projeto.imagemUrl} alt={projeto.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ height: '300px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem Imagem</div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#ccc', whiteSpace: 'pre-wrap' }}>
          {projeto.descricao}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {projeto.linkProjeto && (
            <a href={projeto.linkProjeto} target="_blank" style={btnStylePrimary}>
              <ExternalLink size={20} /> Visitar Site Online
            </a>
          )}

          {projeto.repoGithub && (
            <a href={projeto.repoGithub} target="_blank" style={btnStyleSecondary}>
              <Github size={20} /> Ver Código no GitHub
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

// ... seus estilos (btnStylePrimary, btnStyleSecondary, btnStyleDanger) continuam iguais
const btnStylePrimary = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: '#ccff00', color: 'black', padding: '15px 30px',
  borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem'
};

const btnStyleSecondary = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: 'transparent', color: 'white', padding: '15px 30px',
  borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem', border: '1px solid white'
};

const btnStyleDanger = {
  display: 'flex', alignItems: 'center', gap: '8px',
  background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', padding: '10px 20px',
  borderRadius: '20px', fontWeight: 'bold', border: '1px solid #ff6b6b', 
  cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s'
};