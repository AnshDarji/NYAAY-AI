import logging
from typing import List, Dict, Any, Optional
from rank_bm25 import BM25Okapi
import nltk

# Ensure nltk punkt is downloaded for tokenization
try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)

from app.knowledge.vector_store import vector_store
from app.knowledge.bm25_manager import bm25_manager

logger = logging.getLogger(__name__)

class HybridRetriever:
    def __init__(self):
        # We could cache BM25 indices here, keyed by tenant_id or document_id
        self._bm25_cache = {}
        self._corpus_cache = {}

    def search(self, query: str, query_embedding: List[float], n_results: int = 10, where: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        # 1. Dense Retrieval (ChromaDB)
        dense_results = vector_store.search(query_embedding, n_results=n_results * 2, where=where)
        
        # 2. Fetch corpus and BM25 index from Manager
        tenant_id = where.get("tenant_id", "global") if where else "global"
        bm25, corpus_ids, corpus_docs, corpus_metadatas = bm25_manager.get_index(tenant_id)
        
        if not bm25 or not corpus_docs:
            return dense_results[:n_results]

        tokenized_query = nltk.word_tokenize(query.lower())
        
        # Get BM25 scores
        bm25_scores = bm25.get_scores(tokenized_query)
        
        # 3. Reciprocal Rank Fusion (RRF)
        # We merge dense and sparse rankings
        rrf_scores = {}
        
        # Rank Dense
        for rank, res in enumerate(dense_results):
            chunk_id = res["id"]
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0) + (1.0 / (60 + rank))
            
        # Rank Sparse
        # Sort indices by score descending
        sparse_ranking = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)
        # Take top 50 to avoid ranking everything
        for rank, idx in enumerate(sparse_ranking[:50]):
            chunk_id = corpus_ids[idx]
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0) + (1.0 / (60 + rank))
            
        # 4. Sort and select top n_results
        sorted_rrf = sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)
        top_ids = [item[0] for item in sorted_rrf[:n_results]]
        
        # Reconstruct the final list of dicts
        final_results = []
        for rank, cid in enumerate(top_ids):
            # Find in dense results
            found_dense = None
            for res in dense_results:
                if res["id"] == cid:
                    found_dense = res
                    break
            
            # Check if it was in the top 50 sparse ranking
            is_sparse = False
            for idx in sparse_ranking[:50]:
                if corpus_ids[idx] == cid:
                    is_sparse = True
                    break
            
            retrieval_method = "hybrid" if (found_dense and is_sparse) else "dense" if found_dense else "sparse"
            
            if found_dense:
                found_dense["metadata"]["retrieval_method"] = retrieval_method
                found_dense["metadata"]["retrieval_rank"] = rank + 1
                found_dense["metadata"]["rrf_score"] = rrf_scores[cid]
                final_results.append(found_dense)
            else:
                idx = corpus_ids.index(cid)
                final_results.append({
                    "id": cid,
                    "document": corpus_docs[idx],
                    "metadata": {
                        **corpus_metadatas[idx],
                        "retrieval_method": retrieval_method,
                        "retrieval_rank": rank + 1,
                        "rrf_score": rrf_scores[cid]
                    },
                    "distance": 0.0 # BM25 doesn't use the same distance metric
                })
                
        return final_results

hybrid_retriever = HybridRetriever()
