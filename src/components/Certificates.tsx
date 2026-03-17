import { useState } from 'react';
import type { Certificate } from '../data/projects';

interface CertificatesProps {
  certificates: Certificate[];
  isAdmin: boolean;
  onRemove?: (id: string) => void;
}

const ISSUER_COLORS: Record<string, string> = {
  Rocketseat: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
  Alura:      'bg-blue-500/10 border-blue-500/20 text-blue-300',
  Cisco:      'bg-sky-500/10 border-sky-500/20 text-sky-300',
  'Creator IT': 'bg-green-500/10 border-green-500/20 text-green-300',
};

function getIssuerColor(issuer: string) {
  return ISSUER_COLORS[issuer] || 'bg-white/5 border-white/10 text-white/50';
}

// ── PDF Viewer Modal ──────────────────────────────────────────────────────────

function PdfModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d1b2e] border-b border-white/10 flex-shrink-0">
        <div>
          <p className="text-white font-medium text-sm">{cert.title}</p>
          <p className="text-white/40 text-xs">{cert.issuer} {cert.year && `· ${cert.year}`}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={cert.pdfPath}
            download
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-xs transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Baixar PDF
          </a>
          {cert.url && (
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs transition"
            >
              Link externo ↗
            </a>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center text-lg transition"
          >
            ×
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 min-h-0">
        <iframe
          src={`${cert.pdfPath}#toolbar=0`}
          className="w-full h-full border-0"
          title={cert.title}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function Certificates({ certificates, isAdmin, onRemove }: CertificatesProps) {
  const [openPdf, setOpenPdf] = useState<Certificate | null>(null);

  // Group by issuer
  const groups = certificates.reduce<Record<string, Certificate[]>>((acc, cert) => {
    if (!acc[cert.issuer]) acc[cert.issuer] = [];
    acc[cert.issuer].push(cert);
    return acc;
  }, {});

  return (
    <>
      {openPdf && <PdfModal cert={openPdf} onClose={() => setOpenPdf(null)} />}

      <section id="certificados" className="py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Formação</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Certificados <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">&amp; Cursos</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            Certificações obtidas durante minha jornada de aprendizado contínuo.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groups).map(([issuer, certs]) => (
            <div key={issuer}>
              {/* Issuer header */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getIssuerColor(issuer)}`}>
                  {issuer}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-white/30 text-xs">{certs.length} cert{certs.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Cert rows */}
              <div className="space-y-2">
                {certs.map(cert => (
                  <div
                    key={cert.id}
                    className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 rounded-xl px-5 py-4 transition-all duration-200"
                  >
                    {/* Icon — PDF triggers modal, otherwise trophy */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 border ${getIssuerColor(issuer)} ${cert.pdfPath ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                      onClick={() => cert.pdfPath && setOpenPdf(cert)}
                      title={cert.pdfPath ? 'Ver certificado' : undefined}
                    >
                      {cert.pdfPath ? '📄' : '🏆'}
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-sm">{cert.title}</span>
                        {cert.year && <span className="text-white/30 text-xs">• {cert.year}</span>}
                      </div>
                      {/* Attachment indicators */}
                      <div className="flex items-center gap-3 mt-0.5">
                        {cert.pdfPath && (
                          <button
                            onClick={() => setOpenPdf(cert)}
                            className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 transition"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            Ver certificado
                          </button>
                        )}
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/30 hover:text-indigo-400 text-xs flex items-center gap-1 transition"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                            Link externo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Admin remove */}
                    {isAdmin && onRemove && (
                      <button
                        onClick={() => onRemove(cert.id)}
                        className="text-white/15 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                        title="Remover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <p className="text-5xl mb-4">🎓</p>
            <p>Nenhum certificado adicionado ainda.</p>
          </div>
        )}
      </section>
    </>
  );
}
