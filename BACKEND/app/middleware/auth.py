"""
middleware/auth.py — Firebase ID token verification dependency.

Usage in routes:
    @router.get("/protected")
    async def protected(token: VerifiedToken = Depends(verify_firebase_token)):
        return {"uid": token.uid}
"""

from dataclasses import dataclass

import firebase_admin.auth as firebase_auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

# HTTPBearer extracts the raw Bearer token from the Authorization header.
# auto_error=False lets us return a clean 401 instead of FastAPI's default 403.
_bearer_scheme = HTTPBearer(auto_error=False)


@dataclass
class VerifiedToken:
    """Decoded, verified Firebase ID token payload."""

    uid: str
    email: str
    name: str


def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> VerifiedToken:
    """
    FastAPI dependency that verifies a Firebase ID token.

    - Extracts the Bearer token from the Authorization header.
    - Verifies it using the Firebase Admin SDK.
    - Returns a VerifiedToken with uid, email, and name.
    - Raises HTTP 401 if the header is missing or the token is invalid/expired.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Support local simulator mode in development if keys are mock
    if settings.is_development and token == "mock-token":
        return VerifiedToken(
            uid="mock-uid",
            email="priya@nyaay.ai",
            name="Adv. Priya Sen",
        )

    try:
        decoded = firebase_auth.verify_id_token(token)
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token has been revoked.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate Firebase credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return VerifiedToken(
        uid=decoded["uid"],
        email=decoded.get("email", ""),
        name=decoded.get("name", ""),
    )
