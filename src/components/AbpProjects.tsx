import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Github, Plus, X, Settings, Loader2 } from 'lucide-react';
import { useAbpProjects, useOctacodeRepos, type AbpConfig } from '../hooks/useAbpProjects';
import { AbpProjectCard, AbpAdminCard } from './AbpProjectCard';

interface AbpProjectsProps {
  abpConfig: AbpConfig[];
  isAdmin?: boolean;
  onAddAbpProject: (name: string) => void;
  onRemoveAbpProject: (name: string) => void;
  onUpdateAbpProject: (name: string, updates: Partial<AbpConfig>) => void;
}

export function AbpProjects({
  abpConfig,
  isAdmin,
  onAddAbpProject,
  onRemoveAbpProject,
  onUpdateAbpProject,
}: AbpProjectsProps) {
  const [showManager, setShowManager] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // Projetos visíveis para o visitante
  const { data: projects, isLoading, isError } = useAbpProjects(abpConfig);
  // Todos os repos da org (só carregado no manager)
  const { data: allRepos } = useOctacodeRepos();

  // Repos ainda não adicionados à config
  const configuredNames = abpConfig.map(c => c.name);
  const availableToAdd = allRepos?.filter(r => !configuredNames.includes(r.name)) ?? [];

  // ── Upload de imagem (reutiliza a API /api/uploadFile) ──────────────────
  async function handleImageUpload(
    repoName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Pega a senha do admin armazenada em sessionStorage (igual ao seu sistema)
    const password = sessionStorage.getItem('adminPassword') ?? '';
    if (!password) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    setUploadingFor(repoName);
    try {
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const ext = file.name.split('.').pop() ?? 'png';
      const fileName = `abp-${repoName}.${ext}`;

      const res = await fetch('/api/uploadFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          fileName,
          folder: 'projects',
          base64Content,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onUpdateAbpProject(repoName, { image: json.path });
      } else {
        alert('Erro ao enviar imagem: ' + json.error);
      }
    } catch (err) {
      alert('Erro ao enviar imagem.');
      console.error(err);
    } finally {
      setUploadingFor(null);
      e.target.value = '';
    }
  }

  return (
    <section id="abp" className="py-20 px-4">
      <div className="mx-auto max-w-6xl">

        {/* ── Cabeçalho ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-widest">
              <GraduationCap size={14} />
              Aprendizagem Baseada em Projetos
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Projetos Acadêmicos
            </h2>
            <p className="text-white/50 max-w-lg text-sm leading-relaxed">
              Projetos desenvolvidos em equipe na faculdade, resolvendo problemas reais com tecnologia.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/octacodeteam"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/30 hover:text-white transition-all"
            >
              <Github size={15} />
              octacodeteam
            </a>

            {isAdmin && (
              <button
                onClick={() => setShowManager(true)}
                className="flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-500/20 transition-all"
              >
                <Settings size={15} />
                Gerenciar ABP
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Estados de carregamento / erro ───────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse border border-white/[0.04]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-white/40">
            <Github size={28} className="opacity-40" />
            <p className="text-sm">Não foi possível carregar os projetos.</p>
          </div>
        )}

        {!isLoading && !isError && abpConfig.filter(c => c.visible).length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-white/30">
            <GraduationCap size={28} className="opacity-40" />
            <p className="text-sm">
              {isAdmin
                ? 'Clique em "Gerenciar ABP" para adicionar projetos.'
                : 'Nenhum projeto cadastrado ainda.'}
            </p>
          </div>
        )}

        {/* ── Grid de cards ────────────────────────────────────────────── */}
        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <AbpProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de gerenciamento (admin) ──────────────────────────────── */}
      <AnimatePresence>
        {showManager && isAdmin && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowManager(false)}
            />

            {/* Painel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-[#0d1626] border-l border-white/[0.08] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
                <div>
                  <h3 className="font-semibold text-white">Gerenciar Projetos ABP</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    {abpConfig.length} cadastrado(s) · {abpConfig.filter(c => c.visible).length} visível(is)
                  </p>
                </div>
                <button
                  onClick={() => setShowManager(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

                {/* ── Projetos já cadastrados ─────────────────────────── */}
                {abpConfig.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
                      Cadastrados
                    </h4>
                    <div className="space-y-3">
                      {abpConfig.map(config => (
                        <div key={config.name} className="relative">
                          <AbpAdminCard
                            config={config}
                            onToggleVisible={() =>
                              onUpdateAbpProject(config.name, { visible: !config.visible })
                            }
                            onChangeImage={e => handleImageUpload(config.name, e)}
                            uploading={uploadingFor === config.name}
                          />
                          {/* Botão remover */}
                          <button
                            onClick={() => onRemoveAbpProject(config.name)}
                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity [.relative:hover_&]:opacity-100"
                            aria-label="Remover"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Repos disponíveis para adicionar ───────────────── */}
                <div>
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
                    Disponíveis para adicionar
                  </h4>

                  {!allRepos && (
                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <Loader2 size={14} className="animate-spin" />
                      Buscando repositórios...
                    </div>
                  )}

                  {allRepos && availableToAdd.length === 0 && (
                    <p className="text-sm text-white/30">
                      Todos os repositórios já foram adicionados.
                    </p>
                  )}

                  {availableToAdd.length > 0 && (
                    <div className="space-y-2">
                      {availableToAdd.map(repo => (
                        <div
                          key={repo.id}
                          className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{repo.name}</p>
                            {repo.description && (
                              <p className="text-xs text-white/40 truncate">{repo.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => onAddAbpProject(repo.name)}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20 transition-all"
                          >
                            <Plus size={13} />
                            Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
