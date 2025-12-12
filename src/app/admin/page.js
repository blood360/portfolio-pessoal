"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; // O homem chegou pra deixar bonito
import { LogOut } from 'lucide-react'; // Ícone de sair

export default function AdminPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagemUrl: '',
    linkProjeto: '',
    repoGithub: '',
    tecnologias: ''
  });
  
  const [projetos, setProjetos] = useState([]);
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjetos();
  }, []);

  // --- FUNÇÃO DE SAIR (LOGOUT) ---
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login'); // Manda de volta pro login
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  const fetchProjetos = async () => {
    try {
      const res = await fetch('/api/projetos');
      const data = await res.json();
      if (data.success) setProjetos(data.data);
    } catch (error) {
      console.error("Erro ao buscar lista:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Eita!', 'Imagem muito grande! Use uma menor que 2MB.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imagemUrl: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (projeto) => {
    setEditingId(projeto._id);
    setFormData({
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      imagemUrl: projeto.imagemUrl || '',
      linkProjeto: projeto.linkProjeto || '',
      repoGithub: projeto.repoGithub || '',
      tecnologias: projeto.tecnologias.join(', ')
    });
    setPreview(projeto.imagemUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Feedback visual leve
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({ icon: 'info', title: 'Editando projeto...' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ titulo: '', descricao: '', imagemUrl: '', linkProjeto: '', repoGithub: '', tecnologias: '' });
    setPreview('');
  };

  const handleDelete = async (id) => {
    // Alerta bonitão pra confirmar
    const result = await Swal.fire({
      title: 'Tem certeza, macho?',
      text: "Se apagar, não tem volta!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, pode apagar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/projetos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          Swal.fire('Apagado!', 'O projeto foi pro beleléu.', 'success');
          fetchProjetos();
        } else {
          Swal.fire('Erro!', 'Não deu pra apagar.', 'error');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Erro!', 'Erro de conexão.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Loading...
    Swal.fire({
      title: 'Processando...',
      didOpen: () => { Swal.showLoading() }
    });

    try {
      const techsArray = formData.tecnologias.split(',').map(t => t.trim());
      const payload = { ...formData, tecnologias: techsArray };

      let url = '/api/projetos';
      let method = 'POST';

      if (editingId) {
        url = `/api/projetos/${editingId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire('Sucesso!', editingId ? 'Projeto atualizado!' : 'Projeto criado!', 'success');
        handleCancelEdit();
        fetchProjetos();
      } else {
        Swal.fire('Erro!', 'Deu ruim na operação.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Erro!', 'Erro de conexão.', 'error');
    }
  };

  return (
    <main style={{ padding: '2rem', color: 'white', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* CABEÇALHO DO ADMIN COM LOGOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <div>
           <h1 style={{ color: '#ccff00', margin: 0 }}>Painel do Chefe</h1>
           <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Gerencie seus projetos aqui</p>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#333', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
      
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {editingId ? 'Editando Projeto' : 'Novo Projeto'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#111', padding: '20px', borderRadius: '10px' }}>
        
        <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} style={inputStyle} required />
        <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} required />
        
        <div style={{background: '#1a1a1a', padding: '10px', borderRadius: '8px', border: '1px dashed #444'}}>
          <label style={{color: '#ccff00', fontSize: '0.9rem'}}>Imagem (Upload)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{color: 'white', marginTop: '5px', width: '100%'}} />
          {preview && <img src={preview} alt="Prévia" style={{marginTop: '10px', maxHeight: '100px', borderRadius: '5px'}} />}
        </div>

        <div style={{display: 'flex', gap: '10px'}}>
            <input type="text" name="linkProjeto" placeholder="Link Site" value={formData.linkProjeto} onChange={handleChange} style={inputStyle} />
            <input type="text" name="repoGithub" placeholder="Link GitHub" value={formData.repoGithub} onChange={handleChange} style={inputStyle} />
        </div>

        <input type="text" name="tecnologias" placeholder="Tecnologias (React, Node...)" value={formData.tecnologias} onChange={handleChange} style={inputStyle} />

        <div style={{display: 'flex', gap: '10px'}}>
          <button type="submit" style={{ flex: 1, padding: '15px', background: '#ccff00', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
            {editingId ? 'ATUALIZAR' : 'SALVAR'}
          </button>
          
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '15px', background: '#333', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
              CANCELAR
            </button>
          )}
        </div>
      </form>
      
      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <a href="/" style={{color: '#999'}}>← Voltar para o Site</a>
      </div>

      <hr style={{margin: '3rem 0', borderColor: '#333'}} />

      <h2 style={{color: 'white', marginBottom: '1rem'}}>Projetos Cadastrados ({projetos.length})</h2>
      
      <div style={{display: 'grid', gap: '1rem'}}>
        {projetos.map(proj => (
          <div key={proj._id} style={{background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              <h3 style={{color: '#ccff00', margin: 0}}>{proj.titulo}</h3>
              <p style={{color: '#888', fontSize: '0.8rem', margin: 0}}>{proj.tecnologias.join(', ')}</p>
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                onClick={() => handleEdit(proj)}
                style={{background: 'blue', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer'}}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(proj._id)}
                style={{background: 'red', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer'}}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        {projetos.length === 0 && <p style={{color: '#666'}}>Nenhum projeto encontrado.</p>}
      </div>
    </main>
  );
}

const inputStyle = { width: '100%', padding: '12px', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' };