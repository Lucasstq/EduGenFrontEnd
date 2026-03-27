<div align="center">

# 📚 EduGen — Gerador de Atividades com IA

**Plataforma educacional que utiliza Inteligência Artificial para gerar atividades e listas de exercícios personalizadas para professores do Ensino Fundamental I.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

</div>

---

## 📖 Sobre o Projeto

O **EduGen** é uma aplicação web que permite a professores criarem atividades escolares de forma rápida e inteligente. Basta selecionar a disciplina, o ano escolar, o tema e o nível de dificuldade — a IA cuida do resto, gerando questões variadas e prontas para uso em sala de aula.

### Principais Funcionalidades

- **Geração de atividades com IA** — Crie listas de exercícios com base em disciplina, ano, tema, dificuldade e tipo de questão.
- **Múltiplos tipos de questão** — Múltipla escolha, verdadeiro/falso, dissertativa, preencha as lacunas e variado.
- **PDFs para Alunos e Professores** — Download separado com gabarito e explicações para o professor.
- **Dashboard personalizado** — Estatísticas de atividades criadas e exercícios gerados.
- **Histórico com filtros** — Consulta paginada de atividades anteriores com filtro por disciplina.
- **Gerenciamento de perfil** — Edição de nome de usuário e logout seguro.

### Disciplinas Suportadas

| Disciplina | Disciplina |
|---|---|
| 📐 Matemática | 🌍 Geografia |
| 📝 Português | 🌱 Horticultura |
| 🔬 Ciências | ✝️ Ensino Religioso |
| 📜 História | 🎨 Artes e Educação |

### Anos Escolares

1º ao 5º Ano do Ensino Fundamental

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|---|---|---|
| [React](https://react.dev/) | 19.2 | Biblioteca para construção de interfaces |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Tipagem estática para JavaScript |
| [Vite](https://vite.dev/) | 7.3 | Build tool e dev server |
| [React Router](https://reactrouter.com/) | 7.13 | Roteamento client-side |
| [Axios](https://axios-http.com/) | 1.13 | Cliente HTTP para comunicação com a API |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | 11.0 | Notificações toast |
| [ESLint](https://eslint.org/) | 9.39 | Linting e qualidade de código |

---

## 📁 Estrutura do Projeto

```
src/
├── assets/                     # Recursos estáticos
├── components/
│   ├── ui/                     # Componentes reutilizáveis (Button, Card, Input, Select)
│   ├── pages/
│   │   ├── LoginPage/          # Autenticação (login e cadastro)
│   │   ├── DashboardPage/      # Painel principal com estatísticas
│   │   ├── NewActivityPage/    # Formulário de geração de atividades
│   │   ├── ActivityDetailPage/ # Visualização de atividade gerada
│   │   ├── HistoryPage/        # Histórico de atividades com filtros
│   │   └── ProfilePage/        # Perfil do usuário
│   └── ProtectedRoute.tsx      # Guard de rotas autenticadas
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação global
├── services/
│   ├── api.ts                  # Instância Axios com interceptors
│   ├── auth.service.ts         # Serviço de autenticação e tokens
│   ├── user.service.ts         # Serviço de usuário e dashboard
│   └── worksheet.service.ts    # Serviço de atividades e PDFs
├── styles/
│   └── globals.css             # Estilos globais
├── types/
│   └── api.types.ts            # Tipos, enums e interfaces da API
├── App.tsx                     # Rotas e layout principal
└── main.tsx                    # Ponto de entrada da aplicação
```

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Backend da API rodando (padrão: `http://localhost:8080`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/EduGen_FrontEnd.git

# Acesse o diretório
cd EduGen_FrontEnd

# Instale as dependências
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Execução

```bash
# Modo desenvolvimento (http://localhost:3000)
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Lint
npm run lint
```

> Em desenvolvimento, o Vite configura um proxy automático de `/api` para `http://localhost:8080`, dispensando a variável de ambiente.

---

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em **JWT (JSON Web Tokens)**:

- **Access Token** — Enviado em todas as requisições via header `Authorization: Bearer`.
- **Refresh Token** — Utilizado para renovar o access token automaticamente em caso de expiração (HTTP 401).
- **Logout seguro** — Revoga o token no servidor e limpa o armazenamento local.

Rotas protegidas redirecionam para `/login` caso o usuário não esteja autenticado.

---

## 🗺️ Rotas

| Rota | Página | Acesso |
|---|---|---|
| `/login` | Login / Cadastro | Público |
| `/` | Dashboard | Autenticado |
| `/nova-atividade` | Nova Atividade | Autenticado |
| `/atividade/:id` | Detalhes da Atividade | Autenticado |
| `/historico` | Histórico | Autenticado |
| `/perfil` | Perfil | Autenticado |

---

## ⚠️ Aviso

Este repositório é público **exclusivamente para fins de portfólio**. O código-fonte está disponível para visualização e referência, mas **não é permitido**:

- Clonar, copiar ou redistribuir este projeto (total ou parcialmente).
- Utilizar o código como base para outros projetos.
- Realizar forks com intenção de uso, modificação ou distribuição.

Caso tenha interesse em discutir o projeto ou colaborar, entre em contato diretamente.

## 📄 Licença

**All Rights Reserved** — Todos os direitos reservados. Este projeto não possui licença open-source. A disponibilização pública do código não concede qualquer permissão de uso, cópia, modificação ou distribuição.
