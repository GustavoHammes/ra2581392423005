import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  message: z.string().min(10, { message: "A mensagem precisa ter no mínimo 10 caracteres." }),
});

export const ContactForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(contactFormSchema)
    });
    const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

    const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
        console.log("Enviando dados:", data);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSubmitStatus({ success: true, message: "Mensagem enviada com sucesso! Obrigado pelo contato." });
        reset();
        setTimeout(() => setSubmitStatus(null), 5000);
    };

    return (
        <section id="contato" className="container mx-auto px-6 py-20">
            <motion.h2 
                className="text-4xl font-bold text-center text-white mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                Vamos Conversar?
            </motion.h2>
            <motion.form 
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-xl mx-auto space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                    <input 
                        type="text" 
                        id="name"
                        {...register("name")}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Seu nome completo"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        {...register("email")}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="seu.email@exemplo.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Mensagem</label>
                    <textarea 
                        id="message"
                        rows={5}
                        {...register("message")}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                        placeholder="Deixe sua mensagem aqui..."
                    ></textarea>
                    {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                </div>
                <div className="text-center">
                    <motion.button 
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                        {!isSubmitting && <Send size={18} />}
                    </motion.button>
                </div>
            </motion.form>
            <AnimatePresence>
                {submitStatus && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`mt-6 text-center p-3 rounded-lg ${submitStatus.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}
                    >
                        {submitStatus.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
