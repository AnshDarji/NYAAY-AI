import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.middleware.auth import verify_firebase_token
from app.core.rate_limit import limiter
from unittest.mock import patch, MagicMock

client = TestClient(app)

from fastapi import Request

# Helper to mock successful Firebase Auth
def override_verify_firebase_token_success(request: Request):
    request.state.user = {
        "uid": "test_uid_123",
        "email": "test@nyaay.ai",
        "name": "Test User",
        "role": "citizen"
    }

# Clear any previous dependencies and set our mock
app.dependency_overrides[verify_firebase_token] = override_verify_firebase_token_success

# For rate limiting reset between tests
@pytest.fixture(autouse=True)
def reset_limiter():
    limiter.reset()

def test_kanoon_missing_token():
    # Remove override to test actual middleware behavior
    app.dependency_overrides.pop(verify_firebase_token, None)
    
    response = client.post("/api/kanoon/query", json={"question": "What is the law?"})
    assert response.status_code == 401

    # Restore override for remaining tests
    app.dependency_overrides[verify_firebase_token] = override_verify_firebase_token_success

def test_kanoon_invalid_token():
    app.dependency_overrides.pop(verify_firebase_token, None)
    
    response = client.post(
        "/api/kanoon/query", 
        json={"question": "What is the law?"},
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
    
    app.dependency_overrides[verify_firebase_token] = override_verify_firebase_token_success

def test_kanoon_query_validation_error():
    # Test short question
    response = client.post("/api/kanoon/query", json={"question": "law"})
    assert response.status_code == 422 # Unprocessable Entity
    
    # Test empty question
    response = client.post("/api/kanoon/query", json={"question": ""})
    assert response.status_code == 422

@patch("app.services.kanoon_service.KanoonService.query")
def test_kanoon_valid_query(mock_query):
    # Mock the return value of the service
    from app.schemas.kanoon import KanoonQueryResponse
    mock_query.return_value = KanoonQueryResponse(
        answer="This is a mocked answer.",
        summary="Mocked summary.",
        disclaimer="Mocked disclaimer.",
        category="General Law"
    )

    response = client.post("/api/kanoon/query", json={"question": "What are my fundamental rights?"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "This is a mocked answer."
    assert data["summary"] == "Mocked summary."
    assert data["disclaimer"] == "Mocked disclaimer."
    assert data["category"] == "General Law"

@patch("app.services.kanoon_service.KanoonService.query")
def test_kanoon_rate_limiting(mock_query):
    # Mock the return value
    from app.schemas.kanoon import KanoonQueryResponse
    mock_query.return_value = KanoonQueryResponse(
        answer="A", summary="S", disclaimer="D", category="C"
    )

    # Make 20 requests (our limit)
    for _ in range(20):
        response = client.post("/api/kanoon/query", json={"question": "What is the law?"})
        assert response.status_code == 200
    
    # The 21st request should be rate limited
    response = client.post("/api/kanoon/query", json={"question": "What is the law?"})
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.json()["error"]
