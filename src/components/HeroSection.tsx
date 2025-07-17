import { motion } from 'framer-motion';
import { File, ArrowRight } from 'lucide-react';

export const HeroSection = () => (
  <section id="sobre" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-indigo-500/10 blur-3xl"></div>
    </div>
    
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="container mx-auto px-6"
    >
      <img src="/Gustavo.JPG" alt="Foto de Gustavo Hammes" className="w-64 h-64 md:w-72 md:h-72 mx-auto rounded-full object-cover shadow-lg border-4 border-white"></img>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
        Gustavo Hammes
      </h1>
      <p className="text-xl md:text-2xl text-indigo-300 mb-8 max-w-3xl mx-auto">
        Estudante de Desenvolvimento de Software Multiplataformas, motivado por transformar ideias em realidade através do desenvolvimento full-stack. Tenho foco em React, Node.js, SQL e Python para criar aplicações robustas e centradas no usuário. Busco uma oportunidade para aplicar minhas habilidades de resolução de problemas e colaborar em projetos inovadores.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
          <motion.a 
            href="/Curriculo_Gustavo_Hammes.pdf"
            target="_blank"
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <File size={20} />
            Ver Currículo
          </motion.a>
          <motion.a 
            href="#contato"
            className="flex items-center gap-2 bg-gray-700/50 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            whileHover={{ scale: 1.05, y: -5, backgroundColor: 'rgba(75, 85, 99, 0.7)' }}
            whileTap={{ scale: 0.95 }}
          >
            Entrar em Contato
            <ArrowRight size={20} />
          </motion.a>
      </div>
    </motion.div>
  </section>
);
