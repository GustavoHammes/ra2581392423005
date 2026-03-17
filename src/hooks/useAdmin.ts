import { useState, useEffect, useCallback } from 'react';
import type { Project, Certificate } from '../data/projects';
import { DEFAULT_PROJECTS, DEFAULT_CERTIFICATES } from '../data/projects';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'gh2024admin';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Load data.json on mount (works for all visitors)
  useEffect(() => {
    fetch('/data.json')
      .then(r => r.json())
      .then((d: { projects: Project[]; certificates: Certificate[] }) => {
        if (d.projects) setProjects(d.projects);
        if (d.certificates) setCertificates(d.certificates);
      })
      .catch(() => {
        // fallback to defaults if fetch fails
      })
      .finally(() => setLoading(false));
  }, []);

  // Keyboard shortcut Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdmin) setIsAdmin(false);
        else setShowLoginModal(true);
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

  const logout = useCallback(() => setIsAdmin(false), []);

  // Persist data to GitHub via API (updates data.json in the repo)
  const persist = useCallback(async (
    updatedProjects: Project[],
    updatedCertificates: Certificate[]
  ) => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/saveData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          data: { projects: updatedProjects, certificates: updatedCertificates },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro desconhecido');
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('persist error:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }, []);

  // --- Projects CRUD ---
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    const updated = [...projects, newProject];
    setProjects(updated);
    persist(updated, certificates);
  }, [projects, certificates, persist]);

  const removeProject = useCallback((id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    persist(updated, certificates);
  }, [projects, certificates, persist]);

  const updateProject = useCallback((id: string, data: Partial<Omit<Project, 'id'>>) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...data } : p);
    setProjects(updated);
    persist(updated, certificates);
  }, [projects, certificates, persist]);

  // --- Certificates CRUD ---
  const addCertificate = useCallback((cert: Omit<Certificate, 'id'>) => {
    const newCert = { ...cert, id: Date.now().toString() };
    const updated = [...certificates, newCert];
    setCertificates(updated);
    persist(projects, updated);
  }, [projects, certificates, persist]);

  const removeCertificate = useCallback((id: string) => {
    const updated = certificates.filter(c => c.id !== id);
    setCertificates(updated);
    persist(projects, updated);
  }, [projects, certificates, persist]);

  const updateCertificate = useCallback((id: string, data: Partial<Omit<Certificate, 'id'>>) => {
    const updated = certificates.map(c => c.id === id ? { ...c, ...data } : c);
    setCertificates(updated);
    persist(projects, updated);
  }, [projects, certificates, persist]);

  const resetToDefaults = useCallback(() => {
    setProjects(DEFAULT_PROJECTS);
    setCertificates(DEFAULT_CERTIFICATES);
    persist(DEFAULT_PROJECTS, DEFAULT_CERTIFICATES);
  }, [persist]);

  return {
    isAdmin, showLoginModal, setShowLoginModal,
    login, logout,
    projects, certificates,
    loading, saveStatus,
    addProject, removeProject, updateProject,
    addCertificate, removeCertificate, updateCertificate,
    resetToDefaults,
  };
}
