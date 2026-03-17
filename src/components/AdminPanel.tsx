import { useState } from 'react';
import type { Project, Certificate, ProjectCategory } from '../data/projects';
import type { SaveStatus } from '../hooks/useAdmin';

// ─── Login Modal ──────────────────────────────────────────────────────────────

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
    if (!onLogin(password)) {
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
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white transition text-sm">
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

// ─── Types ────────────────────────────────────────────────────────────────────

const CATEGORIES: ProjectCategory[] = ['Faculdade', 'Pessoal', 'Trabalho', 'Outro'];

const EMPTY_PROJECT: Omit<Project, 'id'> = {
  title: '', description: '', image: '', tags: [], category: 'Pessoal',
  liveUrl: '', githubUrl: '', featured: false,
};
const EMPTY_CERT: Omit<Certificate, 'id'> = { title: '', issuer: '', year: '', url: '' };

// ─── Project Form ─────────────────────────────────────────────────────────────

interface ProjectFormProps {
  initial?: Project;
  onSave: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  title: string;
}

function ProjectForm({ initial, onSave, onCancel, title }: ProjectFormProps) {
  const [form, setForm] = useState<Omit<Project, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_PROJECT }
  );
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(', ') ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-4 space-y-3">
      <p className="text-white/70 text-sm font-medium">{title}</p>

      <input required value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Título *" className="admin-input w-full" />

      <textarea required value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        placeholder="Descrição *" rows={2} className="admin-input w-full resize-none" />

      <input value={form.image}
        onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
        placeholder="URL da imagem (https://...)" className="admin-input w-full" />

      {form.image && (
        <img src={form.image} alt="preview" className="w-full h-28 object-cover rounded-lg opacity-70" />
      )}

      <input value={tagsInput}
        onChange={e => setTagsInput(e.target.value)}
        placeholder="Tags separadas por vírgula: React, TypeScript, Node.js" className="admin-input w-full" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/40 text-xs mb-1 block">Categoria</label>
          <select value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as ProjectCategory }))}
            className="admin-input w-full">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer pt-5">
          <input type="checkbox" checked={form.featured}
            onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
            className="accent-indigo-500 w-4 h-4" />
          ⭐ Destaque
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input value={form.liveUrl ?? ''}
          onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))}
          placeholder="Link ao vivo (opcional)" className="admin-input" />
        <input value={form.githubUrl ?? ''}
          onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
          placeholder="GitHub (opcional)" className="admin-input" />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/40 text-sm hover:text-white transition">
          Cancelar
        </button>
        <button type="submit"
          className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition">
          Salvar projeto
        </button>
      </div>
    </form>
  );
}

// ─── Certificate Form ─────────────────────────────────────────────────────────

interface CertFormProps {
  initial?: Certificate;
  onSave: (data: Omit<Certificate, 'id'>) => void;
  onCancel: () => void;
  title: string;
}

function CertForm({ initial, onSave, onCancel, title }: CertFormProps) {
  const [form, setForm] = useState<Omit<Certificate, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_CERT }
  );

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="bg-white/5 rounded-xl p-4 space-y-3">
      <p className="text-white/70 text-sm font-medium">{title}</p>

      <input required value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Título do certificado *" className="admin-input w-full" />

      <div className="grid grid-cols-2 gap-3">
        <input required value={form.issuer}
          onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))}
          placeholder="Emissor * (ex: Alura)" className="admin-input" />
        <input value={form.year ?? ''}
          onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
          placeholder="Ano (ex: 2025)" className="admin-input" />
      </div>

      <input value={form.url ?? ''}
        onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
        placeholder="Link do certificado (opcional)" className="admin-input w-full" />

      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/40 text-sm hover:text-white transition">
          Cancelar
        </button>
        <button type="submit"
          className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition">
          Salvar certificado
        </button>
      </div>
    </form>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

interface AdminPanelProps {
  projects: Project[];
  certificates: Certificate[];
  saveStatus: SaveStatus;
  onAddProject: (p: Omit<Project, 'id'>) => void;
  onRemoveProject: (id: string) => void;
  onUpdateProject: (id: string, data: Partial<Omit<Project, 'id'>>) => void;
  onAddCertificate: (c: Omit<Certificate, 'id'>) => void;
  onRemoveCertificate: (id: string) => void;
  onUpdateCertificate: (id: string, data: Partial<Omit<Certificate, 'id'>>) => void;
  onReset: () => void;
  onClose: () => void;
}

type FormMode = { type: 'add-project' } | { type: 'edit-project'; project: Project }
              | { type: 'add-cert' }   | { type: 'edit-cert'; cert: Certificate }
              | null;

const STATUS_CONFIG = {
  idle:   { text: '',                   cls: '' },
  saving: { text: '⏳ Salvando...',      cls: 'text-amber-400' },
  saved:  { text: '✓ Salvo no GitHub!', cls: 'text-green-400' },
  error:  { text: '✗ Erro ao salvar',   cls: 'text-red-400' },
};

export function AdminPanel({
  projects, certificates, saveStatus,
  onAddProject, onRemoveProject, onUpdateProject,
  onAddCertificate, onRemoveCertificate, onUpdateCertificate,
  onReset, onClose,
}: AdminPanelProps) {
  const [tab, setTab] = useState<'projects' | 'certs'>('projects');
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const st = STATUS_CONFIG[saveStatus];

  const handleDeleteProject = (id: string) => {
    if (confirmDelete === id) {
      onRemoveProject(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleDeleteCert = (id: string) => {
    if (confirmDelete === id) {
      onRemoveCertificate(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-semibold text-sm">Painel Admin</span>
            {st.text && <span className={`text-xs ${st.cls}`}>{st.text}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onReset}
              className="text-xs text-white/30 hover:text-red-400 transition px-2 py-1">
              Resetar dados
            </button>
            <button onClick={onClose}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-lg transition">
              Fechar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 pb-0 flex-shrink-0">
          {(['projects', 'certs'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setFormMode(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              {t === 'projects' ? `Projetos (${projects.length})` : `Certificados (${certificates.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">

          {/* ── PROJECTS TAB ── */}
          {tab === 'projects' && (
            <>
              {projects.map(p => (
                <div key={p.id}>
                  {formMode?.type === 'edit-project' && formMode.project.id === p.id ? (
                    <ProjectForm
                      title="Editar projeto"
                      initial={p}
                      onSave={data => { onUpdateProject(p.id, data); setFormMode(null); }}
                      onCancel={() => setFormMode(null)}
                    />
                  ) : (
                    <div className="group flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl px-4 py-3 transition">
                      {/* Thumb */}
                      {p.image && (
                        <img src={p.image} alt="" className="w-12 h-10 object-cover rounded-lg flex-shrink-0 opacity-80" />
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-medium truncate">{p.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                            p.category === 'Faculdade' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                            p.category === 'Pessoal'   ? 'bg-green-500/10 border-green-500/20 text-green-300' :
                            p.category === 'Trabalho'  ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                            'bg-white/5 border-white/10 text-white/40'
                          }`}>{p.category}</span>
                          {p.featured && <span className="text-xs text-amber-300 flex-shrink-0">⭐</span>}
                        </div>
                        <p className="text-white/35 text-xs mt-0.5 truncate">{p.tags.join(', ')}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                        <button
                          onClick={() => setFormMode({ type: 'edit-project', project: p })}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs transition">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs transition ${
                            confirmDelete === p.id
                              ? 'bg-red-500 text-white'
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                          }`}>
                          {confirmDelete === p.id ? 'Confirmar?' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add project button / form */}
              {formMode?.type === 'add-project' ? (
                <ProjectForm
                  title="Novo projeto"
                  onSave={data => { onAddProject(data); setFormMode(null); }}
                  onCancel={() => setFormMode(null)}
                />
              ) : (
                formMode === null && (
                  <button onClick={() => setFormMode({ type: 'add-project' })}
                    className="w-full py-3 rounded-xl border border-dashed border-white/15 text-white/35 hover:text-white hover:border-indigo-500 transition text-sm mt-1">
                    + Adicionar projeto
                  </button>
                )
              )}
            </>
          )}

          {/* ── CERTIFICATES TAB ── */}
          {tab === 'certs' && (
            <>
              {certificates.map(c => (
                <div key={c.id}>
                  {formMode?.type === 'edit-cert' && formMode.cert.id === c.id ? (
                    <CertForm
                      title="Editar certificado"
                      initial={c}
                      onSave={data => { onUpdateCertificate(c.id, data); setFormMode(null); }}
                      onCancel={() => setFormMode(null)}
                    />
                  ) : (
                    <div className="group flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl px-4 py-3 transition">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-medium">{c.title}</span>
                          <span className="text-white/35 text-xs">— {c.issuer}</span>
                          {c.year && <span className="text-white/25 text-xs">({c.year})</span>}
                        </div>
                        {c.url && (
                          <a href={c.url} target="_blank" rel="noopener noreferrer"
                            className="text-indigo-400 text-xs hover:underline truncate block mt-0.5">
                            {c.url}
                          </a>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                        <button
                          onClick={() => setFormMode({ type: 'edit-cert', cert: c })}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs transition">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCert(c.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs transition ${
                            confirmDelete === c.id
                              ? 'bg-red-500 text-white'
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                          }`}>
                          {confirmDelete === c.id ? 'Confirmar?' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {formMode?.type === 'add-cert' ? (
                <CertForm
                  title="Novo certificado"
                  onSave={data => { onAddCertificate(data); setFormMode(null); }}
                  onCancel={() => setFormMode(null)}
                />
              ) : (
                formMode === null && (
                  <button onClick={() => setFormMode({ type: 'add-cert' })}
                    className="w-full py-3 rounded-xl border border-dashed border-white/15 text-white/35 hover:text-white hover:border-indigo-500 transition text-sm mt-1">
                    + Adicionar certificado
                  </button>
                )
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 border-t border-white/[0.06] flex-shrink-0">
          <p className="text-white/20 text-xs text-center">
            Passe o mouse sobre um item para ver as opções de editar / remover
          </p>
        </div>
      </div>
    </div>
  );
}
