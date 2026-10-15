# Gustavo Hammes — Portfólio

Portfólio em React, TypeScript e Vite, com funções de API para Vercel. A página combina projetos selecionados, repositórios sincronizados com o GitHub, projetos acadêmicos da Octacode, formação e contato.

## Rodar localmente

```sh
npm ci
npm run dev
```

O Vite também executa os mesmos handlers de `/api` usados na Vercel. A sincronização pública do GitHub funciona sem configurar variáveis. Para contato e administração, copie `.env.example` para `.env.local` e preencha somente o necessário.

```sh
npm test
npm run build
```

## Adicionar um projeto automaticamente

1. Abra um repositório público seu no GitHub.
2. Na seção **About**, preencha uma descrição objetiva e a URL da aplicação em **Website**, se houver.
3. Adicione o tópico **portfolio**. O projeto entrará na seção “Outras ideias em código” após a atualização do cache.

O tópico é uma convenção deste portfólio, independente dos repositórios fixados no perfil. Somente repositórios públicos, ativos e que não sejam forks aparecem nessa seção. Projetos já apresentados em destaque não são repetidos. Os projetos existentes da seleção estão em `src/data/github.ts`; remova um nome dessa lista se quiser controlar sua inclusão exclusivamente pelo tópico.

Os dados são buscados ao abrir o site e novamente a cada 10 minutos enquanto a página estiver aberta. Na Vercel, a resposta permanece fresca por 10 minutos no CDN, com revalidação em segundo plano por até uma hora. A atualização não é instantânea e não precisa de um novo deploy. Se a API estiver fora do ar, a página usa a seleção salva em `src/data/github-snapshot.json` e informa esse estado.

Referências: [tópicos no GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics), [API de repositórios](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user), [cache na Vercel](https://vercel.com/docs/caching/cache-control-headers).

## Escolher os destaques

Marque `featured: true` nos projetos em `public/data.json`, ou use o painel administrativo existente. Mantenha uma seleção pequena e apresente problema, solução, tecnologias e links. Os campos opcionais `summary`, `challenge` e `approach` permitem escrever um resumo e explicar as decisões de cada projeto. Também podem ser editados no painel.

O site usa os screenshots locais, sem depender de imagens aleatórias. Links para código são separados de links para aplicações. Currículo e certificados continuam em `public/`. A configuração de visibilidade e imagens dos trabalhos acadêmicos permanece em `abpConfig` no mesmo JSON.

Ao executar `npm run dev` ou `npm run build`, o script `sync-portfolio.mjs` atualiza a cópia inicial em `src/data/portfolio-defaults.json`. Edite `public/data.json`, que continua sendo a fonte usada pelo painel administrativo.

## Vercel

Mantenha o repositório conectado ao projeto existente, com preset **Vite**, build **npm run build** e saída **dist**. As rotas de `api/` são Vercel Functions. Não é necessário migrar a hospedagem.

Variáveis de ambiente, todas exclusivas do servidor:

| Variável | Uso |
| --- | --- |
| `GITHUB_READ_TOKEN` | Opcional: token de leitura para aumentar os limites de consulta pública. |
| `ADMIN_PASSWORD` | Senha forte para o painel administrativo. |
| `GITHUB_TOKEN` | Token com Contents: Read and write, restrito ao repositório deste portfólio. Usado somente ao salvar ou enviar arquivos pelo painel. |
| `GMAIL_USER` | Conta Gmail que recebe as mensagens. |
| `GMAIL_APP_PASS` | Senha de aplicativo Gmail para o formulário de contato. |

Remova `VITE_ADMIN_PASSWORD` da configuração anterior: variáveis com prefixo `VITE_` são públicas. A validação do login agora acontece no servidor. Sem credenciais de e-mail, o formulário informa a indisponibilidade e os links de e-mail, LinkedIn e WhatsApp continuam utilizáveis.

O painel abre pelo botão discreto no rodapé ou por **Ctrl+Shift+A**. Alterações salvas pelo painel geram commits em `main`, como no fluxo original, e podem acionar o deploy automático da Vercel. A sincronização de leitura dos projetos não cria commits.

## Imagens

```sh
npm run optimize:images
```

Gera versões WebP do retrato e do screenshot maior a partir dos originais. As versões geradas ficam no repositório; não é necessário executar a otimização em cada build.
