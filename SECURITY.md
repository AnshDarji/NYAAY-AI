# Security Policy

## Supported Versions

NYAAY AI is currently in active development. Security fixes are applied to the latest version only.

| Version | Supported |
|---------|-----------|
| Latest (`main`) | ✅ Yes |
| Older releases | ❌ No |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in NYAAY AI, please report it responsibly:

1. **Email:** Open a private GitHub Security Advisory via **Security → Report a vulnerability** in this repository.
2. **Include:**
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested mitigations (optional)

You will receive an acknowledgement within **48 hours** and a detailed response within **7 days**.

## Scope

The following are considered in-scope for security reports:

- Authentication and authorisation bypass
- Firebase token verification flaws
- API endpoint injection vulnerabilities (SQL, prompt injection)
- Sensitive data exposure (API keys, PII, legal documents)
- CORS misconfiguration
- Rate limiting bypass

## Out of Scope

- Vulnerabilities in third-party services (Firebase, Google Gemini API, Indian Kanoon)
- Issues in `BACKEND/devtools/` scripts (development utilities only)
- Social engineering or phishing attacks

## Security Design

- Firebase ID tokens are verified server-side on every authenticated request
- No secrets are stored in the frontend bundle — all sensitive operations go through the backend
- All user-uploaded documents are scoped to the authenticated user's UID
- API keys are loaded exclusively from environment variables — never hardcoded

## Disclosure Policy

We follow **coordinated disclosure**. We ask that you allow us reasonable time to patch and release a fix before any public disclosure.
