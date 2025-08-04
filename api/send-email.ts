// /api/send-email.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Pega a chave de API das variáveis de ambiente da Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: VercelRequest, res: VercelResponse) => {
    // Permite apenas requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Contato <contato@seusiteverificado.com>', // Use o email do seu domínio verificado
            to: ['daffa1632@gmail.com'], // O email onde você quer receber as mensagens
            replyTo: email, // Para responder diretamente ao usuário
            subject: `Nova mensagem do Portfólio de ${name}`,
            html: `
                <h2>Nova mensagem recebida:</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <hr>
                <h3>Mensagem:</h3>
                <p>${message}</p>
            `,
        });

        if (error) {
            console.error({ error });
            return res.status(400).json({ error: 'Erro ao enviar o email.' });
        }

        return res.status(200).json({ message: 'Email enviado com sucesso!', data });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro inesperado.' });
    }
};