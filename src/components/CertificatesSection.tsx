import { motion } from 'framer-motion';
import { certificatesData } from '../data';

export const CertificatesSection = () => (
    <section id="certificados" className="container mx-auto px-6 py-20">
        <motion.h2 
            className="text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            Certificados
        </motion.h2>
        <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
                {certificatesData.map((cert, index) => (
                    <motion.li 
                        key={index}
                        className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg flex justify-between items-center"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    ><a
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white hover:underline"
        >
            {cert.title}
        </a>
                        <span className="text-sm text-slate-400">{cert.issuer}</span>
                    </motion.li>
                ))}
            </ul>
        </div>
    </section>
);
