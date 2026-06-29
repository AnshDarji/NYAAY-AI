import re

def calculate_retrieval_confidence(chunks):
    if not chunks:
        return 0, "🔴 Insufficient", "No relevant authority was found in the indexed knowledge base.", 0.0, 0.0
    
    scores = [c['metadata'].get('rrf_score', 0) for c in chunks]
    avg_score = sum(scores) / len(scores)
    max_score = max(scores)
    
    # New Confidence Logic based on actual presence of governing authorities
    has_statute = any("Act" in c['metadata'].get("source_name", "") or "Code" in c['metadata'].get("source_name", "") or "Sanhita" in c['metadata'].get("source_name", "") or c['metadata'].get('document_type') == 'statute' for c in chunks)
    has_judgment = any("Judgment" in c['metadata'].get("legal_domain", "") or "Supreme Court" in c['metadata'].get("source_name", "") or "SC" in c['metadata'].get("source_name", "") or c['metadata'].get('document_type') == 'judgment' for c in chunks)

    if has_statute and has_judgment:
        score = 95
        label = "🟢 High"
        reason = "Multiple directly applicable statutory provisions and binding judgments support this conclusion."
    elif has_statute:
        score = 80
        label = "🟢 High"
        reason = "Direct statutory provisions govern this issue, providing strong legal support."
    elif has_judgment:
        score = 75
        label = "🟡 Moderate"
        reason = "Case law supports this conclusion, but primary statutory texts were not retrieved."
    else:
        score = 60
        label = "🟠 Limited"
        reason = "Only indirect or related authorities were retrieved. The conclusion relies on analogy."

    return score, label, reason, avg_score, max_score

def validate_response(raw_answer):
    # Dynamic headings mean we can no longer strictly require a fixed set of headers.
    # However, we must still ensure the model doesn't output empty or severely malformed text.
    if len(raw_answer.strip()) < 50:
        return False, "Response is too short to be a valid legal answer."

    # Check if the model hallucinated a likelihood percentage
    if re.search(r'\b\d{2,3}%\s+likelihood\b', raw_answer, re.IGNORECASE):
        return False, "Model hallucinated a numerical likelihood percentage."
        
    return True, raw_answer

def extract_reasoning_confidence(raw_answer):
    # Heuristic: count assumptions and missing facts
    missing_count = len(re.findall(r'(?i)critical missing', raw_answer))
    assumed_count = len(re.findall(r'(?i)facts assumed', raw_answer))
    
    score = 100 - (missing_count * 15) - (assumed_count * 5)
    score = max(0, min(100, score))
    
    if score >= 90:
        return score, f"🟢 High - Facts are clear and well-established."
    elif score >= 70:
        return score, f"🟡 Moderate - Some assumptions required for complete analysis."
    else:
        return score, f"🟠 Limited - Critical facts are missing, impacting analysis."
