import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificatesSection } from './components/CertificatesSection';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';

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
            <HeroSection />
            <ProjectsSection />
            <CertificatesSection />
            <ContactForm />
        </main>
        <Footer />
    </div>
  );
}
