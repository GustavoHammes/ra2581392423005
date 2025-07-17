import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Definindo os tipos para as props do componente
type ProjetoCardProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
};

export const ProjetoCard = ({ title, description, image, link, tags }: ProjetoCardProps) => (
  <motion.div 
    className="bg-slate-800/50 rounded-xl overflow-hidden group relative border border-slate-700/50 flex flex-col"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    {/* 1. Contêiner da Imagem: Agora tem proporção fixa e esconde o overflow do zoom */}
    <div className="aspect-video bg-slate-900/50 overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        // 2. Imagem com object-contain: Garante que a imagem inteira apareça
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out" 
      />
    </div>

    {/* Conteúdo do Card */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
              <span key={tag} className="text-xs font-semibold bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">{tag}</span>
          ))}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4 flex-grow">{description}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors mt-auto"
      >
        Ver projeto
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>

    {/* Efeito de brilho no hover */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </motion.div>
);