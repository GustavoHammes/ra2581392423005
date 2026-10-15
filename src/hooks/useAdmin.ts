import { useState, useEffect, useCallback } from "react";
import type { Project, Certificate } from "../data/projects";
import { DEFAULT_PROJECTS, DEFAULT_CERTIFICATES } from "../data/projects";
import type { AbpConfig } from "./useAbpProjects";
import portfolioData from "../data/portfolio-defaults.json";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES);
  const [abpConfig, setAbpConfig] = useState<AbpConfig[]>(portfolioData.abpConfig);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Load data.json on mount (works for all visitors)
  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then((d: { projects: Project[]; certificates: Certificate[]; abpConfig?: AbpConfig[] }) => {
        if (d.projects) setProjects(d.projects);
        if (d.certificates) setCertificates(d.certificates);
        if (d.abpConfig) setAbpConfig(d.abpConfig);
      })
      .catch(() => {
        // fallback to defaults if fetch fails
      })
      .finally(() => setLoading(false));
  }, []);

  // Keyboard shortcut Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (isAdmin) {
          sessionStorage.removeItem("adminPassword");
          setIsAdmin(false);
        } else setShowLoginModal(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin]);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) return false;
      setIsAdmin(true);
      setShowLoginModal(false);
      sessionStorage.setItem("adminPassword", password);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem("adminPassword");
  }, []);

  // Persist data to GitHub via API (updates data.json in the repo)

  const persist = useCallback(
    async (
      updatedProjects: Project[],
      updatedCertificates: Certificate[],
      updatedAbpConfig: AbpConfig[],
    ) => {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/saveData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: sessionStorage.getItem("adminPassword") ?? "",
            data: {
              projects: updatedProjects,
              certificates: updatedCertificates,
              abpConfig: updatedAbpConfig,
            },
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro desconhecido");
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (err) {
        console.error("persist error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 4000);
      }
    },
    [],
  );

  // --- Projects CRUD ---
  const addProject = useCallback(
    (project: Omit<Project, "id">) => {
      const newProject = { ...project, id: Date.now().toString() };
      const updated = [...projects, newProject];
      setProjects(updated);
      persist(updated, certificates, abpConfig);
    },
    [projects, certificates, abpConfig, persist],
  );

  const removeProject = useCallback(
    (id: string) => {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      persist(updated, certificates, abpConfig);
    },
    [projects, certificates, abpConfig, persist],
  );

  const updateProject = useCallback(
    (id: string, data: Partial<Omit<Project, "id">>) => {
      const updated = projects.map((p) => (p.id === id ? { ...p, ...data } : p));
      setProjects(updated);
      persist(updated, certificates, abpConfig);
    },
    [projects, certificates, abpConfig, persist],
  );

  // --- Certificates CRUD ---
  const addCertificate = useCallback(
    (cert: Omit<Certificate, "id">) => {
      const newCert = { ...cert, id: Date.now().toString() };
      const updated = [...certificates, newCert];
      setCertificates(updated);
      persist(projects, updated, abpConfig);
    },
    [projects, certificates, abpConfig, persist],
  );

  const removeCertificate = useCallback(
    (id: string) => {
      const updated = certificates.filter((c) => c.id !== id);
      setCertificates(updated);
      persist(projects, updated, abpConfig);
    },
    [projects, certificates, abpConfig, persist],
  );

  const updateCertificate = useCallback(
    (id: string, data: Partial<Omit<Certificate, "id">>) => {
      const updated = certificates.map((c) => (c.id === id ? { ...c, ...data } : c));
      setCertificates(updated);
      persist(projects, updated, abpConfig);
    },
    [projects, certificates, abpConfig, persist],
  );

  const resetToDefaults = useCallback(() => {
    setProjects(DEFAULT_PROJECTS);
    setCertificates(DEFAULT_CERTIFICATES);
    persist(DEFAULT_PROJECTS, DEFAULT_CERTIFICATES, abpConfig);
  }, [abpConfig, persist]);

  // Academic projects
  const addAbpProject = useCallback(
    (name: string) => {
      if (abpConfig.some((config) => config.name === name)) return;
      const updated = [...abpConfig, { name, image: "", visible: true }];
      setAbpConfig(updated);
      persist(projects, certificates, updated);
    },
    [abpConfig, projects, certificates, persist],
  );

  const removeAbpProject = useCallback(
    (name: string) => {
      const updated = abpConfig.filter((config) => config.name !== name);
      setAbpConfig(updated);
      persist(projects, certificates, updated);
    },
    [abpConfig, projects, certificates, persist],
  );

  const updateAbpProject = useCallback(
    (name: string, updates: Partial<AbpConfig>) => {
      const updated = abpConfig.map((config) =>
        config.name === name ? { ...config, ...updates } : config,
      );
      setAbpConfig(updated);
      persist(projects, certificates, updated);
    },
    [abpConfig, projects, certificates, persist],
  );

  return {
    isAdmin,
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    projects,
    certificates,
    abpConfig,
    loading,
    saveStatus,
    addProject,
    removeProject,
    updateProject,
    addCertificate,
    removeCertificate,
    updateCertificate,
    addAbpProject,
    removeAbpProject,
    updateAbpProject,
    resetToDefaults,
  };
}
