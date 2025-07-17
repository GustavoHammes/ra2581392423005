import { motion } from 'framer-motion';
import { Github, Linkedin, Smartphone, Mail } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-slate-800 text-slate-400">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
              <p className="font-bold text-white">Gustavo Hammes</p>
              <p className="text-sm">© {new Date().getFullYear()} - Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-6">
              <motion.a href="https://github.com/GustavoHammes" target="_blank" rel="noopener noreferrer" whileHover={{ y: -3, scale: 1.1 }} className="hover:text-indigo-400 transition-colors"><Github /></motion.a>
              <motion.a href="https://www.linkedin.com/in/gustavohammes/" target="_blank" rel="noopener noreferrer" whileHover={{ y: -3, scale: 1.1 }} className="hover:text-indigo-400 transition-colors"><Linkedin /></motion.a>
              <motion.a href="mailto:daffa1632@gmail.com" whileHover={{ y: -3, scale: 1.1 }} className="hover:text-indigo-400 transition-colors"><Mail /></motion.a>
              <motion.a href="https://wa.me/5512996436444" target="_blank" rel="noopener noreferrer" whileHover={{ y: -3, scale: 1.1 }} className="hover:text-indigo-400 transition-colors"><Smartphone /></motion.a>
          </div>
      </div>
  </footer>
);