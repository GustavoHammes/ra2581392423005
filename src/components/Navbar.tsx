import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#formacao", label: "Formação" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <nav className="container navigation" aria-label="Navegação principal">
        <a href="#inicio" className="wordmark" aria-label="Gustavo Hammes, início">
          gh<span>.</span>
          <span className="wordmark-name">Gustavo Hammes</span>
        </a>
        <div id="nav-links" className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="nav-contact" href="#contato" onClick={() => setOpen(false)}>
            Vamos conversar <ArrowUpRight size={16} />
          </a>
        </div>
        <button
          className="menu-toggle icon-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}
