"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push('/admin'); // Se deu bom, vai pro Admin
    } else {
      setError('Senha errada! Tenta de novo.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'white' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', padding: '2rem', border: '1px solid #333', borderRadius: '10px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Lock size={40} color="#ccff00" />
            <h2>Área Restrita</h2>
        </div>

        <input 
            type="password" 
            placeholder="Senha do Chefe" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: 'none', outline: 'none' }}
        />

        {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

        <button type="submit" style={{ padding: '10px', background: '#ccff00', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Entrar
        </button>
        
        <a href="/" style={{ color: '#666', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>Voltar para o site</a>
      </form>
    </div>
  );
}