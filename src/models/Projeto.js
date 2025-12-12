import mongoose from 'mongoose';

const ProjetoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  imagemUrl: { type: String },
  linkProjeto: { type: String },
  repoGithub: { type: String },
  tecnologias: { type: [String], default: [] },
  dataCriacao: { type: Date, default: Date.now },
});

export default mongoose.models.Projeto || mongoose.model('Projeto', ProjetoSchema);