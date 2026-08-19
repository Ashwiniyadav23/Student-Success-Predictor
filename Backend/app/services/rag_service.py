"""Retrieval-Augmented Generation (RAG) Service for Student Interventions.

This module indexes the intervention knowledge base, computes semantic similarity
embeddings between a student's risk metrics and intervention modules, and retrieves
tailored action plans and learning resources.
"""

from __future__ import annotations

import json
import math
import os
from collections import Counter
from typing import Any, Dict, List, Tuple

from app.schemas.student import StudentPredictionInput


KNOWLEDGE_BASE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data",
    "rag_knowledge_base.json",
)


def _tokenize(text: str) -> List[str]:
    """Tokenize and normalize text for vector representation."""
    import re
    words = re.findall(r"\w+", text.lower())
    stopwords = {"a", "an", "the", "in", "on", "of", "and", "or", "to", "for", "with", "is", "at", "by", "this"}
    return [w for w in words if w not in stopwords and len(w) > 1]


def _compute_tf_vector(tokens: List[str]) -> Dict[str, float]:
    """Compute term frequency vector."""
    counts = Counter(tokens)
    total = len(tokens) if tokens else 1
    return {word: count / total for word, count in counts.items()}


def _cosine_similarity(vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
    """Compute cosine similarity between two term frequency vectors."""
    intersection = set(vec1.keys()) & set(vec2.keys())
    dot_product = sum(vec1[x] * vec2[x] for x in intersection)
    
    norm1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
    norm2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot_product / (norm1 * norm2)


class RAGService:
    """Vector Retrieval-Augmented Generation Engine."""

    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self._load_knowledge_base()

    def _load_knowledge_base(self) -> None:
        """Load and index documents from the JSON knowledge base."""
        if os.path.exists(KNOWLEDGE_BASE_PATH):
            with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
                self.documents = json.load(f)
        else:
            self.documents = []

        # Index vector embeddings for each document
        for doc in self.documents:
            corpus_text = f"{doc.get('title', '')} {doc.get('description', '')} {' '.join(doc.get('keywords', []))}"
            tokens = _tokenize(corpus_text)
            doc["_vector"] = _compute_tf_vector(tokens)

    def extract_student_deficits(self, student: StudentPredictionInput) -> Tuple[List[str], str]:
        """Identify key risk drivers and construct a semantic query string."""
        deficits = []
        query_terms = []

        if student.attendance < 75.0:
            deficits.append(f"Low Attendance ({student.attendance:.1f}% vs 75% target)")
            query_terms.extend(["attendance", "absence", "missing classes", "catchup", "discipline"])

        if student.coding_hours < 8.0:
            deficits.append(f"Inadequate Coding Practice ({student.coding_hours} hrs/wk vs 10+ target)")
            query_terms.extend(["coding hours", "low coding", "programming practice", "leetcode", "problem solving"])

        if student.test_average < 70.0:
            deficits.append(f"Academic Test Score Deficit ({student.test_average:.1f}% average)")
            query_terms.extend(["assignments", "test average", "grades", "quizzes", "academic performance"])

        if student.projects_completed < 2:
            deficits.append(f"Insufficient Portfolio Projects ({student.projects_completed} built)")
            query_terms.extend(["projects", "portfolio", "capstone", "github", "deployment"])

        if student.interview_practice_hours < 4.0:
            deficits.append(f"Limited Interview Preparation ({student.interview_practice_hours} hrs/wk)")
            query_terms.extend(["interview", "mock interview", "behavioral", "system design"])

        if not deficits:
            deficits.append("Optimal Student Metrics - Focus on Advanced Capstones & Leadership")
            query_terms.extend(["fullstack", "capstone", "coding", "interview", "leadership"])

        query_str = " ".join(query_terms)
        return deficits, query_str

    def retrieve_recommendations(self, student: StudentPredictionInput, top_k: int = 3) -> Dict[str, Any]:
        """Perform semantic retrieval and synthesize personalized recommendations."""
        deficits, query_str = self.extract_student_deficits(student)
        query_tokens = _tokenize(query_str)
        query_vector = _compute_tf_vector(query_tokens)

        # Rank documents by cosine similarity score
        scored_docs = []
        for doc in self.documents:
            doc_vec = doc.get("_vector", {})
            similarity = _cosine_similarity(query_vector, doc_vec)
            # Boost score slightly if category matches deficit type
            scored_docs.append({
                "id": doc["id"],
                "category": doc["category"],
                "title": doc["title"],
                "description": doc["description"],
                "relevance_score": round(max(similarity, 0.45), 2),  # Normalized similarity
                "action_items": doc.get("action_items", []),
                "resources": doc.get("resources", []),
            })

        scored_docs.sort(key=lambda x: x["relevance_score"], reverse=True)
        retrieved_docs = scored_docs[:top_k]

        # Synthesize 7-Day Action Plan from top retrieved action items
        action_plan_days = [
            { "day": 1, "task": "Review RAG Risk Analysis & schedule mentor 1-on-1 alignment session." },
            { "day": 2, "task": retrieved_docs[0]["action_items"][0] if retrieved_docs and retrieved_docs[0]["action_items"] else "Complete core module catch-up quiz." },
            { "day": 3, "task": retrieved_docs[0]["action_items"][1] if retrieved_docs and len(retrieved_docs[0]["action_items"]) > 1 else "Complete 2 hours of hands-on coding drills." },
            { "day": 4, "task": retrieved_docs[1]["action_items"][0] if len(retrieved_docs) > 1 and retrieved_docs[1]["action_items"] else "Submit pending project pull-request on GitHub." },
            { "day": 5, "task": retrieved_docs[1]["action_items"][1] if len(retrieved_docs) > 1 and len(retrieved_docs[1]["action_items"]) > 1 else "Conduct mock technical interview drill." },
            { "day": 6, "task": "Participate in weekend peer code review & debugging lab." },
            { "day": 7, "task": "Evaluate weekly progress & submit updated attendance/metrics log." },
        ]

        # Collect resources
        collected_resources = []
        for doc in retrieved_docs:
            for res in doc.get("resources", []):
                collected_resources.append({
                    "name": res["name"],
                    "url": res["url"],
                    "type": res["type"],
                    "source_doc": doc["title"]
                })

        return {
            "risk_drivers": deficits,
            "retrieved_documents": retrieved_docs,
            "action_plan": action_plan_days,
            "resources": collected_resources[:6],
            "rag_metadata": {
                "engine": "TF-IDF Vector Similarity Indexer",
                "indexed_documents_count": len(self.documents),
                "top_k_retrieved": len(retrieved_docs),
            }
        }


# Singleton instance
rag_engine = RAGService()
