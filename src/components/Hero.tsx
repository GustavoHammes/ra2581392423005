import { useEffect, useState } from 'react';

const ROLES = [
  'Desenvolvedor Full Stack',
  'React & TypeScript',
  'Node.js & Python',
  'Estudante de DSM',
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <section id="sobre" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-[80px] pointer-events-none" />

      <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Avatar */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-36 h-36 rounded-full border-2 border-white/10 overflow-hidden ring-2 ring-indigo-500/30">
            <img
              src="/Gustavo.JPG"
              alt="Gustavo Hammes"
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Gustavo+Hammes&size=144&background=4f46e5&color=fff&bold=true`;
              }}
            />
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0d1b2e] animate-pulse" />
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight leading-none">
          Gustavo <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Hammes</span>
        </h1>

        {/* Typewriter role */}
        <div className="h-8 flex items-center mb-6">
          <span className="text-lg sm:text-xl text-white/60 font-medium">
            {displayed}
            <span className="inline-block w-0.5 h-5 bg-indigo-400 ml-0.5 animate-blink align-middle" />
          </span>
        </div>

        {/* Description */}
        <p className="max-w-xl text-white/50 text-base leading-relaxed mb-10">
          Estudante de Desenvolvimento de Software Multiplataformas, focado em React, Node.js, SQL e Python.
          Transformando ideias em aplicações robustas e centradas no usuário.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/Currículo_Gustavo_Hammes.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Ver Currículo
          </a>
          <a
            href="#contato"
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            Entrar em Contato
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4 mt-8">
          {[
            { href: 'https://github.com/GustavoHammes', icon: 'github', label: 'GitHub' },
            { href: 'https://linkedin.com/in/gustavohammes', icon: 'linkedin', label: 'LinkedIn' },
          ].map(s => (
            <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors text-sm flex items-center gap-1.5">
              {s.icon === 'github' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              )}
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-xs">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
