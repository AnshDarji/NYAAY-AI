import re
import json
import logging
from typing import Dict, Any, Tuple
from google import genai
from google.genai import types

from app.core.config import settings

logger = logging.getLogger(__name__)

class DomainClassifier:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

        # Rule-based dictionary for fast path
        # Keys are domains, values are lists of regex patterns
        self.rules = {
            "Real Estate": [r"\brera\b", r"\bbuilder\b", r"\bpossession\b", r"\bapartment\b", r"\bflat\b", r"\bdeveloper\b"],
            "Consumer Law": [r"\bconsumer\b", r"\bdeficiency\b", r"\bunfair trade\b", r"\bproduct liability\b"],
            "Criminal Law": [r"\bfir\b", r"\bpolice\b", r"\barrest\b", r"\bbail\b", r"\bmurder\b", r"\btheft\b", r"\bbns\b", r"\bbnss\b"],
            "Constitutional Law": [r"\bwrit\b", r"\bfundamental right\b", r"\bconstitution\b", r"\barticle 32\b", r"\barticle 226\b"],
            "Family Law": [r"\bdivorce\b", r"\bmaintenance\b", r"\bchild custody\b", r"\bhindu marriage act\b", r"\balimony\b"],
            "Corporate Law": [r"\bcompany\b", r"\bshareholder\b", r"\bdirector\b", r"\bincorporation\b", r"\bboard meeting\b"],
            "Tax Law": [r"\bincometax\b", r"\bgst\b", r"\btax evasion\b", r"\btds\b"],
            "Contract Law": [r"\bbreach of contract\b", r"\bagreement\b", r"\bindemnity\b", r"\bspecific performance\b"]
        }
        
        # Heuristics for unsupported jurisdictions
        self.unsupported_jurisdictions = [
            r"\bus constitution\b", r"\bsecond amendment\b", r"\bfirst amendment\b",
            r"\buk law\b", r"\beuropean union\b", r"\bgdpr\b"
        ]
        
        # Heuristics for non-legal queries
        self.non_legal_queries = [
            r"\bjoke\b", r"\brecipe\b", r"\bweather\b", r"\bignore all previous\b"
        ]

    def _rule_based_classification(self, query: str) -> str:
        query_lower = query.lower()
        
        # 1. Check for non-legal or unsupported jurisdictions
        for pattern in self.unsupported_jurisdictions + self.non_legal_queries:
            if re.search(pattern, query_lower):
                return "UNSUPPORTED"
                
        # 2. Check for domain keywords
        domain_scores = {domain: 0 for domain in self.rules.keys()}
        for domain, patterns in self.rules.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    domain_scores[domain] += 1
                    
        # Find the max score
        max_score = 0
        best_domain = "UNKNOWN"
        for domain, score in domain_scores.items():
            if score > max_score:
                max_score = score
                best_domain = domain
                
        # If we have a strong match (at least 2 keywords, or 1 very strong one), use it.
        # For simplicity, if max_score > 0, we'll tentatively use it, but LLM is better for ambiguity.
        if max_score >= 1:
            return best_domain
            
        return "UNKNOWN"

    def predict_domain(self, query: str) -> str:
        """
        Predicts the legal domain of the query.
        Returns the domain string or "UNSUPPORTED" for out-of-scope queries.
        """
        # Fast path: Rule-based
        rule_domain = self._rule_based_classification(query)
        if rule_domain != "UNKNOWN":
            logger.info(f"Domain predicted via rules: {rule_domain}")
            return rule_domain
            
        # Fallback: LLM Classification
        if not self.client:
            return "General Law"
            
        sys_prompt = """You are a Legal Domain Classifier for NYAAY AI, an Indian legal platform.
Determine the primary legal domain of the user's query.
If the query is asking about non-Indian law (e.g., US Constitution, UK Law) or is completely non-legal (e.g., recipes, jokes, general knowledge), output "UNSUPPORTED".
Otherwise, output ONLY the name of the legal domain (e.g., "Real Estate", "Consumer Law", "Criminal Law", "Constitutional Law", "Family Law", "Corporate Law", "Tax Law", "Contract Law").
Respond with strictly the domain string, nothing else.
"""
        try:
            res = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Query: {query}\nDomain:",
                config=types.GenerateContentConfig(
                    system_instruction=sys_prompt,
                    temperature=0.0
                )
            )
            domain = res.text.strip().strip('"').strip()
            logger.info(f"Domain predicted via LLM: {domain}")
            return domain
        except Exception as e:
            logger.warning(f"LLM Domain Classification failed: {e}")
            return "General Law"

domain_classifier = DomainClassifier()
