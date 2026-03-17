import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Erro desconhecido. Tente novamente.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Falha de conexão. Verifique sua internet e tente novamente.');
    }
  };

  return (
    <section id="contato" className="py-24 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Contato</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Vamos <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Conversar?</span>
        </h2>
        <p className="text-white/40 max-w-sm mx-auto">
          Tem um projeto interessante? Quer colaborar ou apenas dizer olá? Manda uma mensagem!
        </p>
      </div>

      {/* Success state */}
      {status === 'success' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Mensagem enviada!</h3>
          <p className="text-white/50 mb-6">Responderei em breve. Fique de olho no seu email!</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-2 transition"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-indigo-500 rounded-xl px-4 py-3.5 text-white placeholder-white/25 outline-none transition text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="seu.email@exemplo.com"
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-indigo-500 rounded-xl px-4 py-3.5 text-white placeholder-white/25 outline-none transition text-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">Mensagem</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Conte-me sobre seu projeto ou ideia..."
              rows={5}
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-indigo-500 rounded-xl px-4 py-3.5 text-white placeholder-white/25 outline-none transition text-sm resize-none"
            />
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl">
              <span>⚠️</span>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Enviando...
              </>
            ) : (
              <>
                Enviar Mensagem
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </>
            )}
          </button>
        </form>
      )}

      {/* Direct links */}
      <div className="flex items-center gap-4 justify-center mt-10">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-white/30 text-xs">ou encontre-me em</span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {[
          { label: 'LinkedIn', href: 'https://linkedin.com/in/gustavohammes', icon: '💼' },
          { label: 'GitHub', href: 'https://github.com/GustavoHammes', icon: '💻' },
          { label: 'Email', href: 'mailto:daffa1632@gmail.com', icon: '✉️' },
          { label: 'WhatsApp', href: 'https://wa.me/+5512996436444', icon: '📱' }
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:border-white/15 text-white/50 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-105">
            <span>{s.icon}</span>
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}
