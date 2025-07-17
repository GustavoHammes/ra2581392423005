import { motion } from 'framer-motion';
import { ProjetoCard } from './ProjetoCard';
import { projectsData } from '../data';

export const ProjectsSection = () => (
  <section id="projetos" className="container mx-auto px-6 py-20">
    <motion.h2 
      className="text-4xl font-bold text-center text-white mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      Meus Projetos
    </motion.h2>
    <div className="grid md:grid-cols-2 gap-8">
      {projectsData.map((project, index) => (
        <ProjetoCard key={index} {...project} />
      ))}
    </div>
  </section>
);
