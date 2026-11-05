# 🏟️ QuantoTa?

> **QuantoTa?** — Aplicativo mobile multiplataforma (iOS & Android) de placar ao vivo e estatísticas de futebol em tempo real, inspirado no SofaScore e OneFootball.

[![Mobile Build](https://github.com/owner/quantota/actions/workflows/build-mobile.yml/badge.svg)](https://github.com/owner/quantota/actions/workflows/build-mobile.yml)
[![API Deploy](https://github.com/owner/quantota/actions/workflows/deploy-api.yml/badge.svg)](https://github.com/owner/quantota/actions/workflows/deploy-api.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📐 Arquitetura

```mermaid
flowchart LR
    subgraph Mobile["📱 App Mobile (Expo / React Native)"]
        RN["React Native + Expo Router"]
        ZUSTAND["Zustand (Favoritos/Cache)"]
        QUERY["TanStack React Query"]
    end

    subgraph Backend["☁️ Backend (Vercel)"]
        API["Next.js 14 API Routes"]
        CRON["Vercel Cron (/api/sync a cada 5m)"]
    end

    subgraph Database["🗄️ Banco de Dados (Neon)"]
        PG["PostgreSQL Serverless"]
        PRISMA["Prisma ORM"]
    end

    subgraph External["🌐 Provedor de Dados"]
        API_FOOTBALL["API-Football (RapidAPI)"]
    end

    subgraph DevOps["⚙️ CI/CD (GitHub Actions)"]
        ACTIONS["Build Automático + Versionamento"]
        EAS["Expo Application Services (EAS Build)"]
        RELEASE["GitHub Releases (Download Direto de APK/IPA)"]
    end

    RN --> API
    API --> PRISMA --> PG
    CRON --> API_FOOTBALL
    ACTIONS --> EAS --> RELEASE
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Mobile** | React Native (Expo SDK 52) | Multiplataforma iOS & Android nativo |
| **Navegação** | Expo Router v3 | Roteamento baseado em arquivos com deep linking |
| **Estilização** | NativeWind v4 (TailwindCSS) | Estilo rápido com tema escuro padrão |
| **Estado Global** | Zustand | Estado local leve e persistente com AsyncStorage |
| **Data Fetching** | TanStack React Query v5 | Cache inteligente, polling ao vivo e refetch |
| **Backend API** | Next.js 14 App Router | Endpoints serverless hospedados na Vercel |
| **Banco de Dados** | Neon PostgreSQL | Banco PostgreSQL serverless gerenciado |
| **ORM** | Prisma | Schema type-safe e migrações estruturadas |
| **Dados Esportivos** | API-Football (RapidAPI) | Dados ao vivo, eventos, escalações e ligas |
| **CI/CD Mobile** | GitHub Actions + EAS Build | Compilação na nuvem e entrega de APK/IPA |

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js >= 18.0.0
- Conta gratuita no [Neon](https://neon.tech)
- Chave de API gratuita no [API-Football (RapidAPI)](https://rapidapi.com/api-sports/api/api-football)
- Conta no [Expo](https://expo.dev) (para compilação remota do APK)

### 2. Clonar e Instalar Dependências
```bash
git clone https://github.com/seu-usuario/QuantoTa.git
cd QuantoTa
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` no root e configure `api/.env`:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@ep-xyz.us-east-2.aws.neon.tech/quantota?sslmode=require"

# API-Football
FOOTBALL_API_KEY="sua_chave_rapidapi"
FOOTBALL_API_HOST="v3.football.api-sports.io"

# URL da API para o Mobile
API_BASE_URL="http://localhost:3000"
```

### 4. Inicializar o Banco de Dados
```bash
# Gerar Prisma client e aplicar schema no Neon
npm run db:push

# Popular dados iniciais de ligas
npm run db:seed
```

### 5. Iniciar Serviços
```bash
# Iniciar API Next.js (porta 3000)
npm run api:dev

# Iniciar App Mobile (Expo)
npm run mobile:start
```

---

## 🤖 CI/CD: Geração de APK sem Gradle Local

O projeto foi desenhado para **não depender de máquina local para compilar**. Todo o fluxo roda nas nuvens via **GitHub Actions + EAS Build**:

1. A cada commit na branch `main`:
   - O workflow `.github/workflows/build-mobile.yml` é disparado.
   - Detecta o tipo de versão (`fix` -> patch, `feat` -> minor, `BREAKING` -> major).
   - Atualiza automaticamente o `mobile/app.json` (`version` e `versionCode`).
   - Dispara o build na nuvem pelo **Expo EAS**.
   - Baixa o APK gerado e publica automaticamente em uma **GitHub Release** com a tag correspondente (`v1.0.1`, `v1.0.2`, etc.).
2. O usuário pode baixar o APK diretamente na aba **Releases** do repositório no GitHub!

### Secrets Necessários no GitHub:
- `EXPO_TOKEN`: Token obtido em `expo.dev/settings/access-tokens`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`: Para deploy automático da API

---

## 📂 Estrutura de Diretórios

```
QuantoTa/
├── .github/
│   └── workflows/
│       ├── build-mobile.yml   # Geração do APK/IPA + GitHub Release
│       ├── deploy-api.yml     # Deploy automático da API na Vercel
│       └── version-bump.yml   # Script de versionamento semântico
├── api/                       # Backend Next.js 14
│   ├── app/api/               # Endpoints REST (matches, leagues, teams, sync)
│   ├── lib/                   # Clientes Prisma, API-Football e Cache
│   ├── prisma/                # Schema PostgreSQL e script de seed
│   └── vercel.json            # Configuração de cron jobs na Vercel
├── mobile/                    # Frontend React Native (Expo)
│   ├── app/                   # Expo Router (telas e navegação)
│   ├── components/            # Componentes reutilizáveis (MatchCard, ScoreBoard, etc.)
│   ├── hooks/                 # React Query hooks
│   ├── services/              # Camada de requisições HTTP
│   ├── stores/                # Zustand stores com persistência
│   └── eas.json               # Perfis de compilação EAS (preview APK)
└── package.json               # Configuração do Workspace Monorepo
```

---

## 📄 Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.
