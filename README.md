# Palpites do Arthurzinho - Aplicação Next.js

## Introdução

Este repositório contém a aplicação web "Palpites do Arthurzinho", um jogo interativo onde os usuários podem palpitar a data e o horário do nascimento do Arthurzinho, com o palpite mais próximo ganhando um brinde especial. O projeto foi desenvolvido com Next.js, utilizando o App Router, TypeScript, Tailwind CSS e Shadcn/UI para uma interface moderna e responsiva. A aplicação inclui autenticação de usuários, um calendário para envio de palpites, animações com AOS e suporte a temas claro/escuro.

A estrutura do projeto é modular, escalável e segue as melhores práticas do Next.js, sendo ideal para expansão ou adaptação a outros projetos web semelhantes. A integração com Firebase está configurada para autenticação e armazenamento de dados.

## Funcionalidades do Projeto

- **Autenticação de Usuários**: Sistema seguro de registro e login, permitindo que os usuários criem contas e acessem seus palpites.
- **Envio de Palpites**: Cada usuário pode enviar um único palpite para a data e horário (entre 1º e 20 de junho de 2025) do nascimento do Arthurzinho usando um calendário interativo.
- **Visualização de Palpites**: Usuários autenticados podem ver os palpites de outros participantes, identificados pelo nome completo ou apelido, exibidos no calendário.
- **Regras do Jogo**: As regras são exibidas nas páginas de Login, Registro e Calendário, detalhando a limitação de um palpite por usuário, o formato do palpite, o prêmio e a visibilidade dos palpites.
- **Design Responsivo**: Interface adaptável para dispositivos móveis e desktops, com layouts lado a lado em telas maiores e empilhados em telas menores.
- **Animações com AOS**: Animações suaves (ex.: `fade-up`, `fade-right`, `zoom-in`) aplicadas via biblioteca AOS para melhorar a experiência do usuário.
- **Tema Claro/Escuro**: Alternância entre temas claro e escuro, com preferências salvas no `localStorage`.
- **Navegação Global**: Cabeçalho com botões de alternância de tema e login/logout disponível em todas as páginas.
- **Integração com Firebase**: Autenticação e armazenamento de palpites utilizando Firebase Authentication e Firestore.

## Estrutura do Projeto

A organização dos diretórios é baseada no Next.js App Router, promovendo modularidade e separação de responsabilidades:
```txt
palpites-arthurzinho/
├── .env.local              # Variáveis de ambiente locais
├── .firebaserc             # Configuração do Firebase
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Documentação do projeto
├── components.json         # Configuração do Shadcn/UI CLI
├── eslint.config.mjs       # Configuração do ESLint
├── firebase.json           # Configuração do Firebase Hosting
├── next-env.d.ts           # Tipagens do Next.js
├── next.config.js          # Configuração do Next.js
├── package-lock.json       # Lockfile do npm
├── package.json            # Dependências e scripts
├── postcss.config.js       # Configuração do PostCSS (Tailwind)
├── project_structure.txt   # Estrutura de diretórios gerada
├── src/
│   ├── app/
│   │   ├── calendar/
│   │   │   └── page.tsx    # Página do calendário
│   │   ├── login/
│   │   │   └── page.tsx    # Página de login
│   │   ├── register/
│   │   │   └── page.tsx    # Página de registro
│   │   ├── layout.tsx      # Layout raiz com provedores e cabeçalho
│   │   └── page.tsx        # Página inicial (opcional)
│   ├── components/
│   │   ├── Header.tsx      # Componente de cabeçalho global
│   │   ├── exemplo-appointment-page.tsx # Exemplo de página de agendamento
│   │   ├── shared/
│   │   │   ├── TimeSelector.tsx # Componente seletor de horário
│   │   │   └── date-picker.tsx  # Componente seletor de data
│   │   └── ui/             # Componentes Shadcn/UI
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── ...         # Outros componentes Shadcn/UI
│   ├── hooks/
│   │   ├── useAppointment.tsx # Hook para gerenciar palpites
│   │   └── useAuth.tsx     # Hook para autenticação
│   ├── lib/
│   │   ├── ThemeProvider.tsx # Provedor de tema claro/escuro
│   │   ├── aos.ts          # Inicialização do AOS
│   │   ├── firebase.ts     # Configuração do Firebase
│   │   └── utils.ts        # Utilitário cn do Shadcn/UI
│   ├── services/
│   │   ├── appointment-service.ts # Serviço para gerenciar palpites
│   │   └── auth-service.ts # Serviço de autenticação
│   ├── styles/
│   │   └── globals.css     # Estilos globais e Tailwind
│   └── types/
│       └── tipos-auth.ts   # Tipagens para autenticação
├── tailwind.config.ts      # Configuração do Tailwind CSS
└── tsconfig.json           # Configuração do TypeScript
```


**Principais Arquivos e Diretórios:**
- **`src/app/`**: Contém as rotas da aplicação (`login`, `register`, `calendar`) e o `layout.tsx` com provedores globais (`ThemeProvider`, `AuthProvider`, `AppointmentProvider`) e o componente `Header`.
- **`src/components/ui/`**: Armazena componentes Shadcn/UI gerados via CLI (ex.: `Button`, `Card`, `Dialog`).
- **`src/lib/aos.ts`**: Inicializa a biblioteca AOS para animações.
- **`src/lib/firebase.ts`**: Configura a conexão com o Firebase.
- **`src/styles/globals.css`**: Inclui diretivas do Tailwind e variáveis de tema.
- **`components.json`**: Configura o CLI do Shadcn/UI.
- **`.env.local`**: Armazena variáveis de ambiente para o Firebase e outras configurações.

## Tecnologias Utilizadas

- **Next.js (latest)**: Framework React com App Router para renderização do lado do servidor e roteamento.
- **React (latest)**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Tipagem estática para maior segurança e colaboração.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Shadcn/UI**: Componentes de UI reutilizáveis baseados em Radix UI e Tailwind CSS.
  - Dependências: `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.
- **AOS (Animate On Scroll)**: Biblioteca para animações baseadas em rolagem (`fade-up`, `fade-right`, `zoom-in`).
- **FullCalendar**: Componente de calendário interativo para seleção e exibição de palpites.
- **Firebase**: Plataforma para autenticação (Firebase Authentication) e armazenamento de dados (Firestore).
- **Lucide React**: Biblioteca de ícones (ex.: `Clock`, `LogIn`, `Moon`).
- **Date-fns**: Biblioteca para manipulação e formatação de datas.
- **ESLint**: Ferramenta para linting de código (configuração em `eslint.config.mjs`).

## Considerações de Escalabilidade

O projeto foi projetado para ser escalável e de fácil manutenção:
- **Estrutura Modular**: Separação clara entre componentes, hooks, serviços e utilitários.
- **App Router**: Utiliza o roteamento flexível do Next.js para organização por funcionalidade.
- **Componentes Reutilizáveis**: Shadcn/UI oferece uma base consistente para a interface.
- **Tipagem Forte**: TypeScript garante segurança em dados de usuários e palpites.
- **Provedores de Contexto**: `ThemeProvider`, `AuthProvider` e `AppointmentProvider` centralizam o gerenciamento de estado, prontos para expansão com bibliotecas como Zustand.
- **Camada de Serviços**: `src/services/` isola a lógica de comunicação com o Firebase, facilitando integração com outros backends.

## Suporte a Multi-acesso e Multi-tarefas

A aplicação suporta múltiplos usuários e tarefas concorrentes:
- **Autenticação**: O hook `useAuth` gerencia sessões de usuários, permitindo acesso simultâneo.
- **Sistema de Palpites**: O hook `useAppointment` controla o envio e recuperação de palpites, garantindo um palpite por usuário e exibição dos palpites de outros.
- **Atualizações em Tempo Real**: Potencial para atualizações ao vivo via Firestore subscriptions (dependendo da configuração do backend).
- **Interface Responsiva**: A UI adapta-se a diferentes dispositivos, garantindo acessibilidade.

