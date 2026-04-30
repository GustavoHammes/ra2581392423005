import { motion } from 'framer-motion';
import { ExternalLink, Star, Eye, EyeOff, ImageIcon } from 'lucide-react';
import type { AbpProject, AbpConfig } from '../hooks/useAbpProjects';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Java: '#b07219', 'C#': '#178600', HTML: '#e34c26', CSS: '#563d7c',
  PHP: '#4F5D95', Go: '#00ADD8', Rust: '#dea584',
};

function formatRepoName(name: string) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ─── Card público (visitante) ──────────────────────────────────────────────
interface AbpProjectCardProps {
  project: AbpProject;
  index: number;
}

export function AbpProjectCard({ project, index }: AbpProjectCardProps) {
  const langColor = project.language ? (LANG_COLORS[project.language] ?? '#8b8b8b') : '#8b8b8b';

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Imagem */}
      <div className="relative h-44 overflow-hidden bg-white/[0.04]">
        {project.image ? (
          <img
            src={project.image}
            alt={`Preview ${project.name}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              (e.target as HTMLImageElement).src =
                `https://opengraph.githubassets.com/1/octacodeteam/${project.name}`;
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon size={32} className="text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
            {formatRepoName(project.name)}
          </h3>
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-white/30 hover:text-white transition-colors"
            aria-label="Ver no GitHub"
          >
            <ExternalLink size={15} />
          </a>
        </div>

        {project.description && (
          <p className="text-xs text-white/50 line-clamp-3 flex-1 leading-relaxed">
            {project.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-3 border-t border-white/[0.06]">
          {project.language && (
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
              {project.language}
            </span>
          )}
          {project.stargazers_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-white/40 ml-auto">
              <Star size={11} />
              {project.stargazers_count}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Card no modo admin ────────────────────────────────────────────────────
interface AbpAdminCardProps {
  config: AbpConfig;
  onToggleVisible: () => void;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export function AbpAdminCard({ config, onToggleVisible, onChangeImage, uploading }: AbpAdminCardProps) {
  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
      config.visible ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/[0.06] bg-white/[0.02] opacity-60'
    }`}>
      {/* Thumbnail */}
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
        {config.image
          ? <img src={config.image} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full items-center justify-center"><ImageIcon size={18} className="text-white/20" /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{formatRepoName(config.name)}</p>
        <p className="text-xs text-white/40 truncate">{config.name}</p>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Upload imagem */}
        <label className={`flex items-center gap-1.5 cursor-pointer rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:border-white/30 hover:text-white transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <ImageIcon size={13} />
          {uploading ? 'Enviando...' : 'Imagem'}
          <input type="file" accept="image/*" className="hidden" onChange={onChangeImage} disabled={uploading} />
        </label>

        {/* Toggle visibilidade */}
        <button
          onClick={onToggleVisible}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-all ${
            config.visible
              ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
              : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
          }`}
        >
          {config.visible ? <Eye size={13} /> : <EyeOff size={13} />}
          {config.visible ? 'Visível' : 'Oculto'}
        </button>
      </div>
    </div>
  );
}
