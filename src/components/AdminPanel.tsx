import { useState, useRef } from 'react';
import { Project, Certificate, ProjectCategory } from '../data/projects';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  onClose: () => void;
}

export function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setError('Senha incorreta.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`bg-[#0d1b2e] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl ${shake ? 'animate-shake' : ''}`}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔐</span>
          <div>
            <h2 className="text-white font-bold text-lg">Modo Admin</h2>
            <p className="text-white/50 text-sm">Digite a senha para continuar</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Senha"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-indigo-500 transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition text-sm">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition text-sm">
              Entrar
            </button>
          </div>
        </form>
        <p className="text-white/30 text-xs text-center mt-4">Atalho: Ctrl+Shift+A</p>
      </div>
    </div>
  );
}

interface AdminPanelProps {
  projects: Project[];
  certificates: Certificate[];
  onAddProject: (p: Omit<Project, 'id'>) => void;
  onRemoveProject: (id: string) => void;
  onAddCertificate: (c: Omit<Certificate, 'id'>) => void;
  onRemoveCertificate: (id: string) => void;
  onReset: () => void;
  onLogout: () => void;
}

const EMPTY_PROJECT: Omit<Project, 'id'> = {
  title: '', description: '', image: '', tags: [], category: 'Pessoal', liveUrl: '', githubUrl: '', featured: false,
};

const EMPTY_CERT: Omit<Certificate, 'id'> = { title: '', issuer: '', year: '', url: '' };

export function AdminPanel({
  projects, certificates,
  onAddProject, onRemoveProject,
  onAddCertificate, onRemoveCertificate,
  onReset, onLogout,
}: AdminPanelProps) {
  const [tab, setTab] = useState<'projects' | 'certs'>('projects');
  const [newProject, setNewProject] = useState(EMPTY_PROJECT);
  const [newCert, setNewCert] = useState(EMPTY_CERT);
  const [tagsInput, setTagsInput] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;
    onAddProject({ ...newProject, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) });
    setNewProject(EMPTY_PROJECT);
    setTagsInput('');
    setShowAddProject(false);
    flashSaved();
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) return;
    onAddCertificate(newCert);
    setNewCert(EMPTY_CERT);
    setShowAddCert(false);
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categories: ProjectCategory[] = ['Faculdade', 'Pessoal', 'Trabalho', 'Outro'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => { if (e.target === e.currentTarget) onLogout(); }}>
      <div ref={panelRef} className="bg-[#0a1628] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-semibold">Painel Admin</span>
            {saved && <span className="text-green-400 text-xs ml-2">✓ Salvo</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onReset} className="text-xs text-white/40 hover:text-red-400 transition">Resetar dados</button>
            <button onClick={onLogout} className="text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-lg transition">Sair (Ctrl+Shift+A)</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-0">
          {(['projects', 'certs'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              {t === 'projects' ? `Projetos (${projects.length})` : `Certificados (${certificates.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {tab === 'projects' && (
            <>
              {projects.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium truncate">{p.title}</span>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{p.category}</span>
                      {p.featured && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">⭐ Destaque</span>}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{p.tags.join(', ')}</p>
                  </div>
                  <button onClick={() => { onRemoveProject(p.id); flashSaved(); }} className="text-white/20 hover:text-red-400 transition text-lg leading-none px-1">×</button>
                </div>
              ))}
              {!showAddProject ? (
                <button onClick={() => setShowAddProject(true)} className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-indigo-500 transition text-sm">
                  + Adicionar projeto
                </button>
              ) : (
                <form onSubmit={handleAddProject} className="bg-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-white/60 text-sm font-medium">Novo projeto</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input required value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} placeholder="Título *" className="col-span-2 admin-input" />
                    <textarea required value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="Descrição *" rows={2} className="col-span-2 admin-input resize-none" />
                    <input value={newProject.image} onChange={e => setNewProject(p => ({ ...p, image: e.target.value }))} placeholder="URL da imagem" className="col-span-2 admin-input" />
                    <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Tags (React, TypeScript, ...)" className="col-span-2 admin-input" />
                    <select value={newProject.category} onChange={e => setNewProject(p => ({ ...p, category: e.target.value as ProjectCategory }))} className="admin-input">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                      <input type="checkbox" checked={newProject.featured} onChange={e => setNewProject(p => ({ ...p, featured: e.target.checked }))} className="accent-indigo-500" />
                      Destaque
                    </label>
                    <input value={newProject.liveUrl} onChange={e => setNewProject(p => ({ ...p, liveUrl: e.target.value }))} placeholder="Link do projeto (opcional)" className="admin-input" />
                    <input value={newProject.githubUrl} onChange={e => setNewProject(p => ({ ...p, githubUrl: e.target.value }))} placeholder="GitHub (opcional)" className="admin-input" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setShowAddProject(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 text-sm hover:text-white transition">Cancelar</button>
                    <button type="submit" className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition">Salvar projeto</button>
                  </div>
                </form>
              )}
            </>
          )}

          {tab === 'certs' && (
            <>
              {certificates.map(c => (
                <div key={c.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex-1">
                    <span className="text-white text-sm">{c.title}</span>
                    <span className="text-white/40 text-xs ml-2">— {c.issuer} {c.year && `(${c.year})`}</span>
                  </div>
                  <button onClick={() => { onRemoveCertificate(c.id); flashSaved(); }} className="text-white/20 hover:text-red-400 transition text-lg leading-none px-1">×</button>
                </div>
              ))}
              {!showAddCert ? (
                <button onClick={() => setShowAddCert(true)} className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-indigo-500 transition text-sm">
                  + Adicionar certificado
                </button>
              ) : (
                <form onSubmit={handleAddCert} className="bg-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-white/60 text-sm font-medium">Novo certificado</p>
                  <input required value={newCert.title} onChange={e => setNewCert(c => ({ ...c, title: e.target.value }))} placeholder="Título *" className="admin-input w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <input required value={newCert.issuer} onChange={e => setNewCert(c => ({ ...c, issuer: e.target.value }))} placeholder="Emissor *" className="admin-input" />
                    <input value={newCert.year || ''} onChange={e => setNewCert(c => ({ ...c, year: e.target.value }))} placeholder="Ano" className="admin-input" />
                  </div>
                  <input value={newCert.url || ''} onChange={e => setNewCert(c => ({ ...c, url: e.target.value }))} placeholder="Link do certificado (opcional)" className="admin-input w-full" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowAddCert(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 text-sm hover:text-white transition">Cancelar</button>
                    <button type="submit" className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition">Salvar</button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
