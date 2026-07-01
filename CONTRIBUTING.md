# Contributing to NYAAY AI

Thank you for your interest in contributing to NYAAY AI — an AI-powered legal workspace for the Indian legal ecosystem.

## Getting Started

1. **Fork** the repository and create your branch from `main`.
2. **Set up** your local environment using the instructions in [`README.md`](README.md).
3. **Understand the architecture** before making changes — see [`DOCS/ARCHITECTURE.md`](DOCS/ARCHITECTURE.md).

## Development Workflow

```bash
# Backend
cd BACKEND
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd FRONTEND
npm install
npm run dev
```

## Before Submitting a Pull Request

- [ ] Application starts cleanly with no errors
- [ ] No secrets, API keys, or database files committed
- [ ] New features include at least a basic test in `BACKEND/tests/`
- [ ] Code follows existing naming conventions
- [ ] No unused imports or dead code introduced

## Coding Standards

### Backend (Python / FastAPI)
- Follow [PEP 8](https://peps.python.org/pep-0008/)
- Use type annotations for all function signatures
- Keep route handlers thin — business logic belongs in `services/`
- Use structured logging via `app.core.logger`

### Frontend (React / JavaScript)
- Functional components with hooks only
- Keep components focused and reusable
- Follow the existing directory structure (`components/`, `pages/`, `services/`)

## Project Structure

See [`DOCS/ARCHITECTURE.md`](DOCS/ARCHITECTURE.md) for a detailed architecture overview and [`DOCS/API_SPEC.md`](DOCS/API_SPEC.md) for the full API reference.

## Reporting Bugs

Open a GitHub Issue with:
- Steps to reproduce
- Expected vs. actual behaviour
- Backend version / environment

## Security Vulnerabilities

**Do not open public issues for security vulnerabilities.** See [`SECURITY.md`](SECURITY.md) for the responsible disclosure process.

## Questions

Open a GitHub Discussion for general questions about the project.
