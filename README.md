# Alizia AI — Frontier Multimodal Frontend

> **Category-Defining Next.js 15+ App Router Frontend for Alizia AI**  
> Features real-time streaming, interactive Gemini Aurora design system, Verifiable Proof Mode, Autonomous Agent Studio, and Hybrid RAG Lab.

---

## 1. Overview & Architecture

The Alizia AI Frontend (`UI/`) provides a fast, responsive, and verifiable multimodal interface engineered with modern web standards:

- **Framework**: Next.js 15+ (App Router) with React 19 and Turbopack compiler.
- **Design System**: Gemini-inspired Aurora Glassmorphism (`src/app/globals.css`), supporting Cyber Dark, Light, and Cyber Aurora theme modes with smooth fluid transitions.
- **Streaming Pipeline**: Server-Sent Events (SSE) consumer with real-time text deltas, thinking process accordion, and `response.proof` event dispatch.
- **Verifiable AI (Proof Mode)**: Sliding verification drawer with atomic claim-to-source highlighting, ephemeral Python sandbox assertion traces, grounding confidence gauges, and cryptographic certificate printing.
- **Voice Intelligence**: Bidirectional speech recognition (Web Speech API) and low-latency voice synthesis with animated audio wavebars.
- **Autonomous Agent Studio**: Interactive 5-stage state machine tracker (`QUEUED` → `PLANNING` → `RUNNING` → `VERIFYING` → `COMPLETED`) with real-time step streaming, evidence capture, and downloadable verification certificates.
- **Knowledge & RAG Lab**: Multi-tenant document indexing, semantic chunk search, vector score inspection, and preview.

---

## 2. Directory Layout

```
UI/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css         # Aurora tokens, glassmorphism, animations
│   │   ├── layout.tsx          # Root HTML layout with Google Inter & JetBrains Mono fonts
│   │   └── page.tsx            # Main application orchestrator
│   ├── components/
│   │   ├── Sidebar.tsx         # Conversation history, model selection, view navigation
│   │   ├── Header.tsx          # Model switcher, backend status indicator, theme toggles
│   │   ├── SettingsModal.tsx   # Backend URL, reasoning effort, auto-TTS, search toggles
│   │   ├── ToastContainer.tsx  # Dynamic floating toast alerts
│   │   ├── MarkdownRenderer.tsx# Syntax-highlighted code blocks with copy action
│   │   ├── chat/
│   │   │   ├── ChatView.tsx    # Primary conversation area
│   │   │   ├── ChatMessage.tsx # Message bubbles with thinking accordion and "Show Proof" trigger
│   │   │   ├── InputDock.tsx   # Glassmorphic dock with attachments, Proof Mode, and voice mic
│   │   │   ├── ProofDrawer.tsx # Slide-over proof inspector with claims, sources, and sandbox tests
│   │   │   └── WelcomeHero.tsx # Aurora welcome hero with quick-start workflow prompt cards
│   │   ├── agents/
│   │   │   └── AgentStudio.tsx # 5-stage agent runner, live execution logs, and proof certificates
│   │   └── rag/
│   │       └── RagLab.tsx      # Vector indexing, tenant-isolated hybrid retrieval tester
│   ├── context/
│   │   └── AppContext.tsx      # Global React state management with LocalStorage persistence
│   ├── services/
│   │   ├── api.ts              # Resilient API client (HTTP + SSE parser + simulation fallback)
│   │   └── speech.ts           # Speech-to-Text and Text-to-Speech audio controller
│   └── types/
│       └── index.ts            # Full TypeScript interfaces for Proof, Agents, RAG, and Chat
├── public/                     # Static assets, branding logos, icons
├── next.config.ts              # Next.js configuration with Turbopack & remote image patterns
├── tailwind.config.ts          # Custom color tokens and keyframe animations
└── package.json                # Project dependencies and npm scripts
```

---

## 3. Getting Started

### Prerequisites
- Node.js 20.x or 22.x
- npm 10+

### Development Mode
```bash
# Navigate to UI directory
cd UI

# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 4. Key Capabilities & Features

### 4.1 Proof Mode (Sprint 2 - Phase 1)
- **Toggle in Input Dock**: Click the **Proof** badge button to enable proof verification on outgoing prompts.
- **Show Proof Badge**: When an answer is received, a `Show Proof (PASS - 98%)` pill appears on the response toolbar.
- **Proof Inspection Drawer**:
  - **Atomic Claims**: Inspect every falsifiable assertion extracted by `ProofEngine`, view grounding confidence, and expand matched source spans.
  - **Grounding Sources**: Explore cited reference documentation and exact snippet spans with relevance scores.
  - **Ephemeral Sandbox Tests**: View automated Python assertion tests executed in the sandbox (`assert ...`), duration in ms, and pass/fail indicators.
  - **Export & Print**: Export proof envelopes as JSON or print certified verification certificates with SHA-256 hashes.

### 4.2 Autonomous Agent Studio
- Switch between **Chat**, **Autonomous Agent**, and **Knowledge RAG** modes via the left sidebar.
- Enter complex operational goals (e.g., *"Deploy canary cluster and verify SSL certs"*).
- Watch the 5-stage state machine execute live with detailed step-by-step evidence logs.

### 4.3 Offline & Resilient Simulator
- When the backend FastAPI / Fastify server is offline, the frontend seamlessly falls back to a high-fidelity client simulation engine, preserving responsiveness without throwing network exceptions.
