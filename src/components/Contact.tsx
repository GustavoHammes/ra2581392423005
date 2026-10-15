import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Github, Linkedin, Loader2, Mail, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(20_000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Não foi possível enviar. Tente pelo e-mail ao lado.");
      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && !/JSON/.test(err.message)
          ? err.message
          : "Não foi possível enviar agora. Entre em contato pelo e-mail ao lado.",
      );
    }
  }
  function change(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }
  return (
    <section id="contato" className="section contact-section" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">
            <span className="section-number">05 /</span> PRÓXIMO PASSO
          </p>
          <h2 id="contact-title">
            Boas ideias começam
            <br />
            com uma <span>conversa.</span>
          </h2>
          <p>
            Tem um projeto em mente, uma oportunidade
            <br className="desktop-break" /> ou vontade de trocar uma ideia? Me escreva.
          </p>
          <a className="contact-email" href="mailto:daffa1632@gmail.com">
            daffa1632@gmail.com <ArrowUpRight size={22} />
          </a>
          <div className="social-links">
            <a href="https://github.com/GustavoHammes" target="_blank" rel="noopener noreferrer">
              <Github size={17} /> GitHub <ArrowUpRight size={13} />
            </a>
            <a
              href="https://linkedin.com/in/gustavohammes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href="https://wa.me/5512996436444" target="_blank" rel="noopener noreferrer">
              WhatsApp <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="contact-form-wrapper">
          {status === "success" ? (
            <div className="contact-success" role="status">
              <Check size={32} />
              <h3>Mensagem enviada.</h3>
              <p>Obrigado pelo contato! Responderei pelo seu e-mail.</p>
              <button className="text-link" onClick={() => setStatus("idle")}>
                Enviar outra mensagem <Mail size={16} />
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="form-two-col">
                <div>
                  <label htmlFor="contact-name">Seu nome</label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Como posso te chamar?"
                    value={form.name}
                    onChange={change}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email">Seu e-mail</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    value={form.email}
                    onChange={change}
                    required
                    maxLength={254}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message">O que vamos construir?</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Me conte sobre sua ideia ou oportunidade..."
                  rows={4}
                  value={form.message}
                  onChange={change}
                  required
                  minLength={10}
                  maxLength={5000}
                />
              </div>
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={form.website}
                  onChange={change}
                />
              </div>
              {status === "error" && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button button-primary"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    Enviando <Loader2 className="animate-spin" size={17} />
                  </>
                ) : (
                  <>
                    Enviar mensagem <Send size={16} />
                  </>
                )}
              </button>
              <p className="form-note">Sua mensagem vai direto para o meu e-mail.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
