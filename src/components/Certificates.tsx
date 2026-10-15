import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import type { Certificate } from "../data/projects";
import { externalUrl } from "../lib/github";

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  return (
    <section id="formacao" className="section container" aria-labelledby="education-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-number">04 /</span> FORMAÇÃO & APRENDIZADO
          </p>
          <h2 id="education-title">
            A prática começa
            <br />
            pela curiosidade.
          </h2>
        </div>
        <p>
          Base técnica, novos conhecimentos
          <br />e aprendizado contínuo.
        </p>
      </div>
      <div className="education-layout">
        <article className="degree-card">
          <GraduationCap size={30} strokeWidth={1.5} />
          <span className="mono">GRADUAÇÃO EM ANDAMENTO</span>
          <h3>Desenvolvimento de Software Multiplataformas</h3>
          <p>Fatec Prof. Francisco de Moura</p>
          <span className="muted">Jacareí, São Paulo</span>
          <div className="degree-bottom">
            <span className="status-dot" /> Aprendendo. Aplicando. Evoluindo.
          </div>
        </article>
        <div className="certificate-list">
          {certificates.map((cert) => {
            const raw = cert.pdfPath || cert.url;
            const href = raw?.startsWith("/") && !raw.startsWith("//") ? raw : externalUrl(raw);
            const content = (
              <>
                <Award size={19} strokeWidth={1.4} />
                <span className="certificate-info">
                  <strong>{cert.title}</strong>
                  <span>
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </span>
                </span>
                {href && <ArrowUpRight size={18} />}
              </>
            );
            return (
              <div className="certificate-row" key={cert.id}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver certificado ${cert.title}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className="certificate-no-link">{content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
