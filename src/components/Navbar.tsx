import { useState, useEffect } from 'react';

interface NavbarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
}

const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#certificados', label: 'Certificados' },
  { href: '#contato', label: 'Contato' },
];

export function Navbar({ isAdmin, onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#0d1b2e]/90 backdrop-blur-md border-b border-white/[0.06] py-3' : 'py-5'}`}>
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#sobre" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">
            GH
          </div>
          <span className="text-white/70 text-sm font-medium hidden sm:block group-hover:text-white transition-colors">
            Gustavo Hammes
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}
              className="text-white/50 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">
              {link.label}
            </a>
          ))}
          {/* Admin indicator */}
          {isAdmin && (
            <button onClick={onAdminClick} className="ml-2 flex items-center gap-1.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-600/30 transition">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Admin
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/60 hover:text-white p-2"
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1b2e]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-3 space-y-1">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block text-white/60 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition text-sm font-medium">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
