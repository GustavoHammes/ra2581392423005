import { useState } from 'react';
import { useAdmin } from './hooks/useAdmin';
import { AdminLogin, AdminPanel } from './components/AdminPanel';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { AbpProjects } from './components/AbpProjects';   // ← NOVO
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';

function Footer({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <footer className="border-t border-white/[0.06] py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white/30 text-sm">
          © {new Date().getFullYear()} Gustavo Hammes · Todos os direitos reservados.
        </div>
        <div className="flex items-center gap-4">
          {[
            { href: 'https://github.com/GustavoHammes', icon: 'github' },
            { href: 'https://linkedin.com/in/gustavo-hammes', icon: 'linkedin' },
            { href: 'mailto:daffa1632@gmail.com', icon: 'mail' },
            { href: 'https://wa.me/+5512996436444', icon: 'smartphone' },
          ].map(s => (
            <a key={s.icon} href={s.href}
              target={s.icon !== 'mail' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors">
              {s.icon === 'github' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              )}
              {s.icon === 'linkedin' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 24 22.222 0h.003z"/>
                </svg>
              )}
              {s.icon === 'mail' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              )}
              {s.icon === 'smartphone' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M22,6.55a12.61,12.61,0,0,0-.1-1.29,4.29,4.29,0,0,0-.37-1.08,3.66,3.66,0,0,0-.71-1,3.91,3.91,0,0,0-1-.71,4.28,4.28,0,0,0-1.08-.36A10.21,10.21,0,0,0,17.46,2H6.55a12.61,12.61,0,0,0-1.29.1,4.29,4.29,0,0,0-1.08.37,3.66,3.66,0,0,0-1,.71,3.91,3.91,0,0,0-.71,1,4.28,4.28,0,0,0-.36,1.08A10.21,10.21,0,0,0,2,6.54C2,6.73,2,7,2,7.08v9.84c0,.11,0,.35,0,.53a12.61,12.61,0,0,0,.1,1.29,4.29,4.29,0,0,0,.37,1.08,3.66,3.66,0,0,0,.71,1,3.91,3.91,0,0,0,1,.71,4.28,4.28,0,0,0,1.08.36A10.21,10.21,0,0,0,6.54,22H17.45a12.61,12.61,0,0,0,1.29-.1,4.29,4.29,0,0,0,1.08-.37,3.66,3.66,0,0,0,1-.71,3.91,3.91,0,0,0,.71-1,4.28,4.28,0,0,0,.36-1.08A10.21,10.21,0,0,0,22,17.46c0-.19,0-.43,0-.54V7.08C22,7,22,6.73,22,6.55ZM12.23,19h0A7.12,7.12,0,0,1,8.8,18.1L5,19.1l1-3.72a7.11,7.11,0,0,1-1-3.58A7.18,7.18,0,1,1,12.23,19Zm0-13.13A6,6,0,0,0,7.18,15l.14.23-.6,2.19L9,16.8l.22.13a6,6,0,0,0,3,.83h0a6,6,0,0,0,6-6,6,6,0,0,0-6-6Zm3.5,8.52a1.82,1.82,0,0,1-1.21.85,2.33,2.33,0,0,1-1.12-.07,8.9,8.9,0,0,1-1-.38,8,8,0,0,1-3.06-2.7,3.48,3.48,0,0,1-.73-1.85,2,2,0,0,1,.63-1.5.65.65,0,0,1,.48-.22H10c.11,0,.26,0,.4.31s.51,1.24.56,1.33a.34.34,0,0,1,0,.31,1.14,1.14,0,0,1-.18.3c-.09.11-.19.24-.27.32s-.18.18-.08.36a5.56,5.56,0,0,0,1,1.24,5,5,0,0,0,1.44.89c.18.09.29.08.39,0s.45-.52.57-.7.24-.15.4-.09,1.05.49,1.23.58.29.13.34.21A1.56,1.56,0,0,1,15.73,14.36Z"/>
                </svg>
              )}
            </a>
          ))}
          <button
            onClick={onAdminClick}
            className="text-white/10 hover:text-white/30 transition-colors text-base"
            title="Modo admin (Ctrl+Shift+A)"
          >⚙</button>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const {
    isAdmin, showLoginModal, setShowLoginModal,
    login, logout,
    projects, certificates,
    abpConfig,              // ← NOVO
    loading, saveStatus,
    addProject, removeProject, updateProject,
    addCertificate, removeCertificate, updateCertificate,
    addAbpProject,          // ← NOVO
    removeAbpProject,       // ← NOVO
    updateAbpProject,       // ← NOVO
    resetToDefaults,
  } = useAdmin();

  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) setShowAdminPanel(true);
    else setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080f1e]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white/40 text-sm">Carregando...</span>
          </div>
        </div>
      )}

      {/* Admin floating badge */}
      {isAdmin && (
        <div
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-indigo-600/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full shadow-lg cursor-pointer hover:bg-indigo-500 transition"
          onClick={() => setShowAdminPanel(true)}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
          Modo Admin · Clique para editar
          {saveStatus === 'saving' && <span className="text-amber-300 ml-1">⏳</span>}
          {saveStatus === 'saved'  && <span className="text-green-300 ml-1">✓</span>}
          {saveStatus === 'error'  && <span className="text-red-300 ml-1">✗</span>}
        </div>
      )}

      {/* Modals */}
      {showLoginModal && (
        <AdminLogin onLogin={login} onClose={() => setShowLoginModal(false)} />
      )}
      {isAdmin && showAdminPanel && (
        <AdminPanel
          projects={projects}
          certificates={certificates}
          saveStatus={saveStatus}
          onAddProject={addProject}
          onRemoveProject={removeProject}
          onUpdateProject={updateProject}
          onAddCertificate={addCertificate}
          onRemoveCertificate={removeCertificate}
          onUpdateCertificate={updateCertificate}
          onReset={resetToDefaults}
          onClose={() => { setShowAdminPanel(false); logout(); }}
        />
      )}

      {/* Site */}
      <Navbar isAdmin={isAdmin} onAdminClick={handleAdminClick} />
      <main>
        <Hero />
        <Projects
          projects={projects}
          isAdmin={isAdmin}
          onRemove={isAdmin ? removeProject : undefined}
        />

        {/* ── Seção de Projetos ABP ────────────────────────────── */}
        <AbpProjects
          abpConfig={abpConfig}
          isAdmin={isAdmin}
          onAddAbpProject={addAbpProject}
          onRemoveAbpProject={removeAbpProject}
          onUpdateAbpProject={updateAbpProject}
        />

        <Certificates
          certificates={certificates}
          isAdmin={isAdmin}
          onRemove={isAdmin ? removeCertificate : undefined}
        />
        <Contact />
      </main>
      <Footer onAdminClick={handleAdminClick} />
    </div>
  );
}
