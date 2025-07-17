import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#projetos", label: "Projetos" },
    { href: "#certificados", label: "Certificados" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
      isScrolled ? "bg-slate-900/80 backdrop-blur-lg shadow-lg shadow-indigo-900/10" : "bg-transparent"
    )}>
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between text-gray-200">
        <motion.a 
          href="#" 
          className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors"
          whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(129, 140, 248)" }}
        >
          GH
        </motion.a>
        
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link, i) => (
            <motion.li key={link.href}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <a href={link.href} className="relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.li>
          ))}
        </ul>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 text-white">
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-0 w-full h-screen bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
            >
              <ul className="flex flex-col gap-8 text-2xl text-center">
                {navLinks.map((link) => (
                  <li key={`mobile-${link.href}`}>
                    <a href={link.href} onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
