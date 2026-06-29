# NYAAY AI 2.0 — Architecture Document

## System Topology
NYAAY AI 2.0 is a containerized microservice architecture consisting of:
1. **Frontend**: React-based SPA served via Nginx.
2. **Backend**: FastAPI web server handling orchestration.
3. **Database**: SQLite (SQLAlchemy) for relational data (users, history).
4. **Vector Store**: ChromaDB for dense document embeddings.
5. **LLM Engine**: Google Gemini API for generation and embeddings.

## Data Flow
1. **User Request**: User submits a query via Frontend.
2. **Authentication**: Request is validated via Firebase Auth Middleware.
3. **Hybrid Retrieval**: Query is sent to ChromaDB (Dense) and BM25 (Sparse).
4. **RAG Orchestrator**: Results are fused, re-ranked, and packaged into a Prompt.
5. **Generation**: LLM generates a response with citations.
6. **Persistence**: Response is stored in SQLite and returned to Frontend.
