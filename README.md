# NYAAY AI — Indian Legal AI Workspace

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini_API-Google-4285F4?style=flat-square&logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)

**An AI-powered legal workspace designed for the Indian legal ecosystem.**
Legal Reasoning · Document Drafting · Document Analysis · Know Your Kanoon

</div>

---

NYAAY AI is a full-stack, AI-powered legal assistant designed for the Indian legal context. It uses the Gemini API and a custom Retrieval-Augmented Generation (RAG) pipeline to support legal reasoning, legal document drafting, and analysis of uploaded PDFs/DOCX files against Indian legal corpora.

---

## Key Features

* **Deterministic Metadata-Aware Legal Engine:** Queries a custom RAG pipeline built on Indian legal corpora using a hybrid approach (BM25 + Embeddings) enhanced with deterministic metadata-filtering (Domain Classification & Document Type tagging) to strictly eliminate hallucination and context leakage.
* **360-Degree Legal Reasoning:** Conducts an exhaustive, 360-degree jurisprudential analysis of complex user situations. It deeply evaluates the facts against the retrieved statutes to provide users with absolute clarity on their legal standing in sophisticated language.
* **Document Drafting:** Generates structured legal drafts such as notices, agreements, complaints, and applications — with a deterministic PDF/DOCX pipeline that prevents LLM hallucination of formatting.
* **Document Upload and Chat:** Allows users to upload PDFs/DOCX files and ask questions, extract insights, or summarize complex documents.
* **Know Your Kanoon:** Answers Indian legal queries with citations sourced from the RAG knowledge base.
* **Authentication and History:** Uses Firebase authentication with persistent chat/document records stored through the backend.
* **Counter Arguments:** Generates counter-argument analysis for legal positions.

## Data Corpus & RAG Architecture

NYAAY AI is built on a highly curated, deterministic legal knowledge base designed specifically to eliminate AI hallucination—the most critical failure point in legal tech.

### 1. The Corpus
* **Phase 1 (Statutory Law):** We have successfully ingested **93 Indian Bare Acts** (including the new Bharatiya Nyaya Sanhita, CPC, CrPC, and various domain-specific laws) into our vector database.
* **Phase 2 (Case Law / Precedent):** We have successfully acquired and prepared **4,369 Supreme Court Judgments**. We have integrated a few to verify quality and are preparing to process the remainder, but the raw database is complete and ready.

### 2. Solving Hallucination at the Root
Most legal AI tools suffer from "context leakage"—for example, retrieving the Indian Penal Code (Theft) when a user asks if a housing society can ban a pet dog. Many systems try to fix this by adding a secondary "LLM Reranker" to clean up the bad retrieval, which doubles API costs and latency.

**NYAAY AI solves this at the root retrieval layer:**
Instead of relying solely on blind vector similarity, our ingestion pipeline extracts rich metadata (Legal Domain, Document Type, and Cited Sections). When a query is made, our `domain_classifier` determines the nature of the case (e.g., Family Law vs. Criminal Law). 

Our custom `hybrid_retriever` (combining BM25 keyword search with dense embeddings) then applies a **Deterministic Metadata Bonus**. It mathematically forces the database to surface statutes matching the exact domain, instantly eliminating thousands of irrelevant civil cases from a criminal query. This results in hyper-accurate, verifiable legal responses directly from the Bare Acts, without the need for expensive LLM reranking.

---

## Architecture

NYAAY AI follows a clean separation between the AI/RAG layer and the web API layer.

```mermaid
flowchart TD
    %% Frontend
    subgraph Frontend ["FRONTEND (React)"]
        UI["Landing • Dashboard • Legal Reasoning • Drafting • Upload Chat"]
    end

    %% Backend
    subgraph Backend ["BACKEND (FastAPI)"]
        direction TB
        
        subgraph Core [" "]
            direction LR
            Routes["<b>Routes</b><br/>/auth<br/>/reasoning<br/>/drafting<br/>/kanoon<br/>/upload<br/>/chat"]
            Services["<b>Services</b><br/>auth_service<br/>doc_service<br/>kanoon_svc<br/>upload_svc"]
            AI["<b>AI Orchestrators</b><br/>rag_orchestrator<br/>drafting_orchestrator<br/>domain_classifier<br/>prompt_builder"]
        end
        
        RAG["<b>Knowledge Layer (RAG)</b><br/>ChromaDB • BM25 • Embeddings<br/>Hybrid Retriever"]
        
        Infra["<b>Infrastructure & Data</b><br/>SQLite (SQLAlchemy) • Firebase Admin SDK • SlowAPI"]
        
        Routes --> Services
        Services --> AI
        AI --> RAG
        
        Core -.- Infra
        RAG -.- Infra
    end

    Frontend -- "HTTPS / REST" --> Backend

    style Frontend fill:#1e40af,color:#fff,stroke:#3b82f6,stroke-width:2px
    style Backend fill:#0f172a,color:#fff,stroke:#475569,stroke-width:2px
    style Core fill:#1e293b,color:#fff,stroke:none
    style Routes fill:#334155,color:#f8fafc,stroke:#94a3b8,stroke-width:1px
    style Services fill:#334155,color:#f8fafc,stroke:#94a3b8,stroke-width:1px
    style AI fill:#334155,color:#f8fafc,stroke:#94a3b8,stroke-width:1px
    style RAG fill:#064e3b,color:#f8fafc,stroke:#34d399,stroke-width:1px
    style Infra fill:#1e293b,color:#cbd5e1,stroke:#64748b,stroke-dasharray: 5 5
```

### Drafting Pipeline (Deterministic)

```mermaid
flowchart TD
    A(["User Facts (Chat/Form)"]) --> B{"Intent Classification"}
    B -->|Draft Request| C["Template Schema Loading"]
    C --> D{"Missing Info Wizard"}
    D -->|Ask User| A
    D -->|All Info Present| E["Gemini LLM<br/>(JSON Generation)"]
    E --> F["Pydantic Validation"]
    F -->|Fail| E
    F -->|Pass| G["StructuredDocumentObject"]
    G --> H["DocumentGenerator"]
    H --> I(["PDF / DOCX<br/>(Identical Output)"])

    style A fill:#f1f5f9,color:#0f172a,stroke:#cbd5e1
    style B fill:#3b82f6,color:#fff,stroke:#2563eb
    style C fill:#334155,color:#fff,stroke:#64748b
    style D fill:#3b82f6,color:#fff,stroke:#2563eb
    style E fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style F fill:#3b82f6,color:#fff,stroke:#2563eb
    style G fill:#334155,color:#fff,stroke:#64748b
    style H fill:#334155,color:#fff,stroke:#64748b
    style I fill:#10b981,color:#fff,stroke:#059669
```

> **Architectural guarantee:** Formatting is deterministic and code-controlled. The LLM never generates formatting — only legally accurate content. See [`DOCS/ARCHITECTURE.md`](DOCS/ARCHITECTURE.md) for the full specification.

---

## Technology Stack

### Backend

* **Framework:** FastAPI
* **AI and LLM:** Google Gemini API (`google-genai`) with a custom RAG pipeline
* **Vector Store:** ChromaDB with hybrid BM25 + embedding retrieval
* **Database:** SQLite with SQLAlchemy
* **Authentication:** Firebase Admin SDK (server-side token verification)
* **Document Processing:** PyMuPDF and python-docx
* **Rate Limiting:** SlowAPI

### Frontend

* **Framework:** React 18 with Vite
* **Styling:** Tailwind CSS
* **Authentication:** Firebase Auth (client-side)
* **API Client:** Axios
* **Routing:** React Router v6

---

## Project Structure

```
NYAAY-AI/
├── BACKEND/
│   ├── app/                        ← Production FastAPI application
│   │   ├── ai/                     ← Orchestrators, prompt builder, guardrails
│   │   ├── api/                    ← Shared API utilities
│   │   ├── core/                   ← Config, Firebase, logger, metrics
│   │   ├── database/               ← SQLAlchemy engine and session
│   │   ├── ingestion/              ← Document ingestion pipeline
│   │   ├── knowledge/              ← ChromaDB, BM25, hybrid retrieval
│   │   ├── middleware/             ← Firebase token verification
│   │   ├── models/                 ← SQLAlchemy models
│   │   ├── routes/                 ← FastAPI route handlers
│   │   ├── schemas/                ← Pydantic schemas
│   │   ├── services/               ← Business logic services
│   │   ├── templates/              ← Legal document templates
│   │   └── main.py                 ← Application entry point
│   ├── tests/                      ← Pytest test suite (unit, e2e, load)
│   ├── scripts/                    ← Corpus management tooling
│   ├── devtools/                   ← Dev utilities and smoke tests
│   ├── data/                       ← Corpus manifests and data management
│   ├── eval/                       ← Evaluation framework
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
├── FRONTEND/
│   ├── src/
│   │   ├── components/             ← Reusable UI components
│   │   ├── pages/                  ← Page-level React components
│   │   ├── services/               ← API service layer
│   │   ├── contexts/               ← React context providers
│   │   ├── hooks/                  ← Custom React hooks
│   │   ├── layouts/                ← Layout wrappers
│   │   └── routes/                 ← Route definitions
│   ├── package.json
│   └── .env.example
│
├── DOCS/                           ← Architecture, API spec, PRDs, decisions
├── README.md
├── SECURITY.md
└── CODE_OF_CONDUCT.md
```

---

## Quickstart

### Prerequisites

* Python 3.11+
* Node.js 18+
* A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)
* A Firebase project with Authentication enabled

### Setup Instructions

**Backend:**

```bash
cd BACKEND
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
cp .env.example .env           # then fill in your values
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd FRONTEND
npm install
cp .env.example .env           # then fill in your Firebase config
npm run dev
```

The frontend dev server runs at `http://localhost:5173`.

### Environment Variables

Copy the example files and populate them with your credentials:

| File | Purpose |
|------|---------|
| `BACKEND/.env.example` | Gemini API key, Firebase admin config, database URL |
| `FRONTEND/.env.example` | Firebase client config, backend API URL |

> **Security note:** Never commit `.env` files. All secret values should be loaded from environment variables at runtime. See [`SECURITY.md`](SECURITY.md) for the full security policy.

---

## Running Tests

```bash
cd BACKEND
pip install -r requirements.txt
pytest tests/ -v
```

Load tests use [Locust](https://locust.io/) (`BACKEND/tests/load/`).
Development smoke tests are in `BACKEND/devtools/`.

---

## Future Roadmap

* **Court Filing Integration** — direct integration with eCourts APIs
* **Multi-language Support** — Hindi and regional language interfaces
* **Expanded Document Templates** — court petitions, bail applications, writ petitions
* **Lawyer Marketplace** — connect citizens with verified legal professionals
* **Offline Mode** — Progressive Web App with cached corpus for low-connectivity regions

---

## Documentation

| Document | Description |
|----------|-------------|
| [`DOCS/ARCHITECTURE.md`](DOCS/ARCHITECTURE.md) | Drafting engine architecture and design principles |
| [`DOCS/API_SPEC.md`](DOCS/API_SPEC.md) | Full API specification |
| [`DOCS/DATABASE_SCHEMA.md`](DOCS/DATABASE_SCHEMA.md) | Database schema documentation |
| [`DOCS/RAG_ARCHITECTURE.md`](DOCS/RAG_ARCHITECTURE.md) | RAG pipeline design |
| [`DOCS/DECISIONS.md`](DOCS/DECISIONS.md) | Architecture Decision Records (ADRs) |
| [`DOCS/DEVELOPER_GUIDE.md`](DOCS/DEVELOPER_GUIDE.md) | Developer setup and workflow |

---
