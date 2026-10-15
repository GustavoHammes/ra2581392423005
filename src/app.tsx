import { lazy, Suspense, useState } from "react";
import { ArrowUpRight, Github, Settings, X } from "lucide-react";
import { useAdmin } from "./hooks/useAdmin";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { GitHubProjects } from "./components/GitHubProjects";
import { AbpProjects } from "./components/AbpProjects";
import { About } from "./components/About";
import { Certificates } from "./components/Certificates";
import { Contact } from "./components/Contact";

const AdminLogin = lazy(() =>
  import("./components/AdminPanel").then((module) => ({ default: module.AdminLogin })),
);
const AdminPanel = lazy(() =>
  import("./components/AdminPanel").then((module) => ({ default: module.AdminPanel })),
);

export default function App() {
  const admin = useAdmin();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  function openAdmin() {
    if (admin.isAdmin) setShowAdminPanel(true);
    else admin.setShowLoginModal(true);
  }
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Projects
          projects={admin.projects}
          isAdmin={admin.isAdmin}
          onRemove={admin.isAdmin ? admin.removeProject : undefined}
        />
        <GitHubProjects projects={admin.projects} />
        <AbpProjects
          abpConfig={admin.abpConfig}
          isAdmin={admin.isAdmin}
          onAddAbpProject={admin.addAbpProject}
          onRemoveAbpProject={admin.removeAbpProject}
          onUpdateAbpProject={admin.updateAbpProject}
        />
        <About />
        <Certificates
          certificates={admin.certificates}
          isAdmin={admin.isAdmin}
          onRemove={admin.isAdmin ? admin.removeCertificate : undefined}
        />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <a className="wordmark" href="#inicio" aria-label="Voltar ao início">
            gh<span>.</span>
          </a>
          <p>
            © {new Date().getFullYear()} Gustavo Hammes<span className="footer-dot">·</span>Feito
            com intenção, do começo ao código.
          </p>
          <div className="footer-links">
            <a
              href="https://github.com/GustavoHammes/ra2581392423005"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={14} /> Código deste site <ArrowUpRight size={13} />
            </a>
            <button
              className="icon-button"
              onClick={openAdmin}
              aria-label="Abrir administração"
              title="Administração (Ctrl+Shift+A)"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </footer>
      {admin.isAdmin && (
        <div className="admin-badge">
          <button onClick={() => setShowAdminPanel(true)}>
            Editar portfólio ·{" "}
            {admin.saveStatus === "saving"
              ? "Salvando..."
              : admin.saveStatus === "saved"
                ? "Salvo"
                : admin.saveStatus === "error"
                  ? "Erro ao salvar"
                  : "Admin"}
          </button>
          <button className="icon-button" aria-label="Sair da administração" onClick={admin.logout}>
            <X size={15} />
          </button>
        </div>
      )}
      <Suspense
        fallback={
          <div className="admin-loading" role="status">
            Carregando administração...
          </div>
        }
      >
        {admin.showLoginModal && (
          <AdminLogin onLogin={admin.login} onClose={() => admin.setShowLoginModal(false)} />
        )}
        {admin.isAdmin && showAdminPanel && (
          <AdminPanel
            projects={admin.projects}
            certificates={admin.certificates}
            saveStatus={admin.saveStatus}
            onAddProject={admin.addProject}
            onRemoveProject={admin.removeProject}
            onUpdateProject={admin.updateProject}
            onAddCertificate={admin.addCertificate}
            onRemoveCertificate={admin.removeCertificate}
            onUpdateCertificate={admin.updateCertificate}
            onReset={admin.resetToDefaults}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </Suspense>
    </>
  );
}
