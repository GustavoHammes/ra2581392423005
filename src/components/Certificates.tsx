import { Certificate } from '../data/projects';

interface CertificatesProps {
  certificates: Certificate[];
  isAdmin: boolean;
  onRemove?: (id: string) => void;
}

const ISSUER_COLORS: Record<string, string> = {
  Rocketseat: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
  Alura: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  Cisco: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
  'Creator IT': 'bg-green-500/10 border-green-500/20 text-green-300',
};

function getIssuerColor(issuer: string) {
  return ISSUER_COLORS[issuer] || 'bg-white/5 border-white/10 text-white/50';
}

export function Certificates({ certificates, isAdmin, onRemove }: CertificatesProps) {
  // Group by issuer
  const groups = certificates.reduce<Record<string, Certificate[]>>((acc, cert) => {
    if (!acc[cert.issuer]) acc[cert.issuer] = [];
    acc[cert.issuer].push(cert);
    return acc;
  }, {});

  return (
    <section id="certificados" className="py-24 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Formação</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Certificados <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">&amp; Cursos</span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto">Certificações obtidas durante minha jornada de aprendizado contínuo.</p>
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

            {/* Cert list */}
            <div className="space-y-2">
              {certs.map((cert, i) => (
                <div
                  key={cert.id}
                  className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 rounded-xl px-5 py-4 transition-all duration-200"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 border ${getIssuerColor(issuer)}`}>
                    🏆
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {cert.url ? (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer"
                        className="text-white font-medium text-sm hover:text-indigo-300 transition-colors">
                        {cert.title}
                      </a>
                    ) : (
                      <span className="text-white font-medium text-sm">{cert.title}</span>
                    )}
                    {cert.year && <span className="text-white/30 text-xs ml-2">• {cert.year}</span>}
                  </div>

                  {/* Link icon */}
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer"
                      className="text-white/20 hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}

                  {/* Admin remove */}
                  {isAdmin && onRemove && (
                    <button
                      onClick={() => onRemove(cert.id)}
                      className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                      title="Remover"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
  );
}
