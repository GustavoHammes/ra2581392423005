import { useState, useEffect, useCallback } from 'react';
import { Project, Certificate, DEFAULT_PROJECTS, DEFAULT_CERTIFICATES } from '../data/projects';

const ADMIN_PASSWORD = 'Hammes1801@'; // Troque essa senha!
const STORAGE_KEY_PROJECTS = 'gh_portfolio_projects';
const STORAGE_KEY_CERTS = 'gh_portfolio_certs';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
      return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CERTS);
      return stored ? JSON.parse(stored) : DEFAULT_CERTIFICATES;
    } catch {
      return DEFAULT_CERTIFICATES;
    }
  });

  // Atalho Ctrl+Shift+A para abrir o painel admin
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdmin) {
          setIsAdmin(false);
        } else {
          setShowLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin]);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const saveProjects = useCallback((updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
  }, []);

  const saveCertificates = useCallback((updated: Certificate[]) => {
    setCertificates(updated);
    localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(updated));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    saveProjects([...projects, newProject]);
  }, [projects, saveProjects]);

  const removeProject = useCallback((id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
  }, [projects, saveProjects]);

  const addCertificate = useCallback((cert: Omit<Certificate, 'id'>) => {
    const newCert = { ...cert, id: Date.now().toString() };
    saveCertificates([...certificates, newCert]);
  }, [certificates, saveCertificates]);

  const removeCertificate = useCallback((id: string) => {
    saveCertificates(certificates.filter(c => c.id !== id));
  }, [certificates, saveCertificates]);

  const resetToDefaults = useCallback(() => {
    saveProjects(DEFAULT_PROJECTS);
    saveCertificates(DEFAULT_CERTIFICATES);
  }, [saveProjects, saveCertificates]);

  return {
    isAdmin, showLoginModal, setShowLoginModal,
    login, logout,
    projects, certificates,
    addProject, removeProject,
    addCertificate, removeCertificate,
    resetToDefaults,
  };
}
