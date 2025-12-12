"use client";

import { useState, useEffect } from "react";
import { Play, Download, X, Code, Github, Terminal, Mail, Linkedin, MapPin } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [projetos, setProjetos] = useState([]); 

  useEffect(() => {
    async function fetchProjetos() {
      try {
        const response = await fetch('/api/projetos'); 
        const data = await response.json();
        if (data.success) {
          setProjetos(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    }
    fetchProjetos();
  }, []);

  const skills = [
    { id: "python", name: "Python", icon: <Terminal size={32} color="#ccff00" />, description: "Utilizo Python para automação, scripts e backend. Experiência em criar assistentes de voz e análise de dados." },
    { id: "js", name: "JavaScript", icon: <Code size={32} color="#ccff00" />, description: "Minha linguagem principal para Web. Domino manipulação de DOM e lógica para interfaces dinâmicas." },
    { id: "next", name: "Next.js", icon: <Play size={32} color="#ccff00" />, description: "Criação de aplicações React rápidas, com foco em SSR e otimização para o Google (SEO)." },
    { id: "github", name: "GitHub", icon: <Github size={32} color="#ccff00" />, description: "Controle de versão essencial para gerenciar códigos e trabalhar em equipe." }
  ];

  return (
    <main>
      <nav className="navbar">
        <div className="logo-container"><div className="logo-icon">AS</div><span>Adriano Santos</span></div>
        <div className="nav-links">
          <a href="#home">Home</a><a href="#sobre">Sobre Mim</a><a href="#projetos">Projetos</a><a href="#contato">Contato</a>
        </div>
        <button className="btn-login" onClick={() => window.location.href='/admin'}>Área Admin</button>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hello-box">Olá, seja bem-vindo!<span className="corner tl"></span><span className="corner tr"></span><span className="corner bl"></span><span className="corner br"></span></div>
          <h1>Soluções de TI Inovadoras <br /><span className="text-highlight">que Geram Resultados</span></h1>
          <p>Estudante de Engenharia de Software. Da Marinha ao teclado no VS Code, trago disciplina e foco para desenvolver soluções web de alto nível.</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => document.getElementById('projetos').scrollIntoView()}>Ver Projetos <div className="icon-circle"><Play size={10} /></div></button>
            <button className="btn-secondary" onClick={() => document.getElementById('contato').scrollIntoView()}>Me Contrate</button>
          </div>
        </div>
        
        {/* --- A FOTO  DO PERFIL --- */}
        <div className="hero-image-container">
          <div className="green-blob"></div>
          <Image
            src="/images/perfil.png"
            alt="Foto de Adriano Santos"
            width={400}
            height={400}
            className="profile-photo"
            priority
          />
        </div>
        {/* ---------------------------------- */}

      </section>

      <section id="sobre">
        <h2 className="section-title">Sobre Mim</h2>
        <div className="about-container">
          <p className="about-text">Programador em desenvolvimento, ex-militar (7 anos de Marinha) e motorista de app, e sub-chef de cozinha hoje focado 100% em tecnologia. Especialista em resolver problemas com código limpo e interfaces modernas.</p>
          <button className="btn-download"><Download size={20} /> Baixar Currículo</button>
          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill.id} className="skill-card" onClick={() => setSelectedSkill(skill)}>
                {skill.icon}<span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedSkill && (
        <div className="modal-overlay" onClick={() => setSelectedSkill(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedSkill(null)}><X size={24} /></button>
            <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'center'}}>{selectedSkill.icon}</div>
            <h3 style={{fontSize: '1.5rem', color: '#ccff00', marginBottom: '1rem'}}>{selectedSkill.name}</h3>
            <p style={{color: '#ddd'}}>{selectedSkill.description}</p>
          </div>
        </div>
      )}

      <section id="projetos">
        <h2 className="section-title">Meus Projetos</h2>
        {projetos.length === 0 && (<div style={{textAlign: 'center', color: '#666', padding: '2rem'}}>Carregando projetos do banco de dados...</div>)}

        <div className="projects-grid">
          {projetos.map((proj) => (
            <div key={proj._id} className="project-card">
              
              {/* LÓGICA DA IMAGEM DO PROJETO */}
              {proj.imagemUrl ? (
                <img 
                  src={proj.imagemUrl} 
                  alt={proj.titulo} 
                  className="project-image" 
                  style={{width: '100%', height: '200px', objectFit: 'cover'}}
                />
              ) : (
                <div className="project-image" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444'}}>
                  Sem Imagem
                </div>
              )}

              <div className="project-info">
                <h3>{proj.titulo}</h3>
                <p>{proj.descricao}</p>
                
                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px'}}>
                  {proj.tecnologias && proj.tecnologias.map((tech, index) => (
                    <span key={index} style={{fontSize: '0.7rem', background: '#222', padding: '2px 8px', borderRadius: '4px', color: '#ccff00'}}>{tech}</span>
                  ))}
                </div>

                <a href={`/projeto/${proj._id}`} className="btn-secondary" style={{fontSize: '0.8rem', padding: '8px 20px', textDecoration: 'none', display: 'inline-block'}}>
                  Ver Detalhes
                </a>
                
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contato">
        <h2 className="section-title">Vamos Conversar?</h2>
        <div className="contact-container">
          <p style={{color: '#999', marginBottom: '2rem', textAlign: 'center'}}>Tem um projeto em mente ou quer apenas bater um papo sobre tecnologia? Manda um salve que eu respondo rápido!</p>
          <form className="contact-form">
            <div className="form-group"><label className="form-label">Seu Nome</label><input type="text" className="form-input" placeholder="Como devo te chamar?" /></div>
            <div className="form-group"><label className="form-label">Seu E-mail</label><input type="email" className="form-input" placeholder="exemplo@email.com" /></div>
            <div className="form-group"><label className="form-label">Mensagem</label><textarea className="form-textarea" placeholder="Conta aí, qual é a ideia?"></textarea></div>
            <button type="submit" className="btn-submit">Enviar Mensagem</button>
          </form>
          <div className="contact-info">
            <div className="info-item"><Mail size={20} color="#ccff00" /><span>adrianocarvalhonav@gmail.com</span></div>
            <div className="info-item"><Linkedin size={20} color="#ccff00" /><span>/in/adrianosantosenigner</span></div>
            <div className="info-item"><MapPin size={20} color="#ccff00" /><span>Rio de Janeiro, Brasil</span></div>
          </div>
        </div>
      </section>
      <footer style={{textAlign: 'center', padding: '2rem', color: '#666', fontSize: '0.9rem', borderTop: '1px solid #222'}}><p>© 2025 Adriano Solutions. Feito com Next.js e muito café.</p></footer>
    </main>
  );
}