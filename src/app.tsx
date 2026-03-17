import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <div className="bg-slate-900 text-gray-300 font-sans antialiased selection:bg-indigo-500/30">
        <style>{`
          /* Adicionando animações personalizadas */
          @keyframes subtle-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
            50% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          }
          .animate-subtle-pulse {
            animation: subtle-pulse 2s infinite;
          }
          html {
            scroll-behavior: smooth;
          }
        `}</style>
        
        <Navbar />
        <main>
            <Hero />
            <Projects />
            <Certificates />
            <Contact />
        </main>
    </div>
  );
}
