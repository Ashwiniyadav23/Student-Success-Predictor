"""Retrieval-Augmented Generation (RAG) Service for Student Interventions.

This module indexes the intervention knowledge base into a persistent ChromaDB
vector database using SentenceTransformers (all-MiniLM-L6-v2) embeddings, and
retrieves tailored action plans and learning resources via semantic search.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Tuple

# pyrefly: ignore [missing-import]
import chromadb
# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer

from app.schemas.student import StudentPredictionInput

KNOWLEDGE_BASE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data",
    "rag_knowledge_base.json",
)

CHROMA_STORE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data",
    "chroma_store",
)


class RAGService:
    """ChromaDB & SentenceTransformers Vector Retrieval-Augmented Generation Engine."""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.embedding_model = SentenceTransformer(self.model_name)
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_STORE_DIR)
        self.collection = self.chroma_client.get_or_create_collection(
            name="student_interventions",
            metadata={"hnsw:space": "cosine"},
        )
        self.documents_by_id: Dict[str, Dict[str, Any]] = {}
        self._initialize_knowledge_base()

    def _initialize_knowledge_base(self) -> None:
        """Load documents and populate ChromaDB vector store if not already indexed."""
        raw_documents: List[Dict[str, Any]] = []
        if os.path.exists(KNOWLEDGE_BASE_PATH):
            with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
                raw_documents = json.load(f)

        self.documents_by_id = {doc["id"]: doc for doc in raw_documents}

        # Only re-embed and re-index if collection is currently empty
        if self.collection.count() == 0 and raw_documents:
            ids: List[str] = []
            documents_text: List[str] = []
            metadatas: List[Dict[str, Any]] = []

            for doc in raw_documents:
                doc_id = doc["id"]
                title = doc.get("title", "")
                desc = doc.get("description", "")
                keywords = ", ".join(doc.get("keywords", []))

                ids.append(doc_id)
                # Formulate natural text representation for embedding
                corpus_text = f"Title: {title}. Description: {desc}. Focus topics: {keywords}."
                documents_text.append(corpus_text)

                metadatas.append({
                    "category": doc.get("category", ""),
                    "title": title,
                    "description": desc,
                    "action_items": json.dumps(doc.get("action_items", [])),
                    "resources": json.dumps(doc.get("resources", [])),
                })

            embeddings = self.embedding_model.encode(documents_text).tolist()
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents_text,
            )

    def extract_student_deficits(self, student: StudentPredictionInput) -> Tuple[List[str], str]:
        """Identify key risk drivers and construct a natural-language sentence query for embedding."""
        deficits: List[str] = []
        query_sentences: List[str] = []

        if student.attendance < 75.0:
            deficits.append(f"Low Attendance ({student.attendance:.1f}% vs 75% target)")
            query_sentences.append(
                f"Student has a low attendance rate of {student.attendance:.1f}% and needs attendance recovery, discipline, and session catchup support"
            )

        if student.coding_hours < 8.0:
            deficits.append(f"Inadequate Coding Practice ({student.coding_hours} hrs/wk vs 10+ target)")
            query_sentences.append(
                f"Student logs low weekly coding practice of only {student.coding_hours} hours requiring daily hands-on programming drills and logic building"
            )

        if student.test_average < 70.0:
            deficits.append(f"Academic Test Score Deficit ({student.test_average:.1f}% average)")
            query_sentences.append(
                f"Student academic test average is low at {student.test_average:.1f}% needing assignment catchup, quiz reviews, and exam preparation"
            )

        if student.projects_completed < 2:
            deficits.append(f"Insufficient Portfolio Projects ({student.projects_completed} built)")
            query_sentences.append(
                f"Student has completed only {student.projects_completed} portfolio projects needing capstone project building, GitHub commits, and deployment guidance"
            )

        if student.interview_practice_hours < 4.0:
            deficits.append(f"Limited Interview Preparation ({student.interview_practice_hours} hrs/wk)")
            query_sentences.append(
                f"Student spends limited time on interview practice with {student.interview_practice_hours} hours per week needing mock technical interviews and system design mastery"
            )

        if not deficits:
            deficits.append("Optimal Student Metrics - Focus on Advanced Capstones & Leadership")
            query_sentences.append(
                "Student demonstrates strong performance metrics and needs advanced fullstack capstones, peer mentorship, and leadership preparation"
            )

        query_str = " ".join(query_sentences)
        return deficits, query_str

    def retrieve_recommendations(self, student: StudentPredictionInput, top_k: int = 3) -> Dict[str, Any]:
        """Perform semantic vector retrieval via ChromaDB and synthesize personalized recommendations."""
        deficits, query_str = self.extract_student_deficits(student)

        # Generate vector embedding for the natural-language query sentence
        query_embedding = self.embedding_model.encode(query_str).tolist()

        # Query persistent ChromaDB vector store
        query_results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        ids = query_results["ids"][0] if query_results.get("ids") and len(query_results["ids"]) > 0 else []
        distances = query_results["distances"][0] if query_results.get("distances") and len(query_results["distances"]) > 0 else []
        metadatas = query_results["metadatas"][0] if query_results.get("metadatas") and len(query_results["metadatas"]) > 0 else []

        scored_docs: List[Dict[str, Any]] = []
        for doc_id, dist, meta in zip(ids, distances, metadatas):
            doc = self.documents_by_id.get(doc_id, {})
            # Cosine similarity calculation: similarity = 1 - distance
            similarity = 1.0 - float(dist)
            relevance_score = round(max(similarity, 0.0), 2)

            action_items = doc.get("action_items")
            if action_items is None:
                action_items = json.loads(meta.get("action_items", "[]"))

            resources = doc.get("resources")
            if resources is None:
                resources = json.loads(meta.get("resources", "[]"))

            scored_docs.append({
                "id": doc_id,
                "category": doc.get("category", meta.get("category", "")),
                "title": doc.get("title", meta.get("title", "")),
                "description": doc.get("description", meta.get("description", "")),
                "relevance_score": relevance_score,
                "action_items": action_items,
                "resources": resources,
            })

        retrieved_docs = scored_docs[:top_k]

        # Synthesize 7-Day Action Plan from top retrieved action items
        action_plan_days = [
            {"day": 1, "task": "Review RAG Risk Analysis & schedule mentor 1-on-1 alignment session."},
            {"day": 2, "task": retrieved_docs[0]["action_items"][0] if retrieved_docs and retrieved_docs[0]["action_items"] else "Complete core module catch-up quiz."},
            {"day": 3, "task": retrieved_docs[0]["action_items"][1] if retrieved_docs and len(retrieved_docs[0]["action_items"]) > 1 else "Complete 2 hours of hands-on coding drills."},
            {"day": 4, "task": retrieved_docs[1]["action_items"][0] if len(retrieved_docs) > 1 and retrieved_docs[1]["action_items"] else "Submit pending project pull-request on GitHub."},
            {"day": 5, "task": retrieved_docs[1]["action_items"][1] if len(retrieved_docs) > 1 and len(retrieved_docs[1]["action_items"]) > 1 else "Conduct mock technical interview drill."},
            {"day": 6, "task": "Participate in weekend peer code review & debugging lab."},
            {"day": 7, "task": "Evaluate weekly progress & submit updated attendance/metrics log."},
        ]

        # Collect learning resources
        collected_resources = []
        for doc in retrieved_docs:
            for res in doc.get("resources", []):
                collected_resources.append({
                    "name": res["name"],
                    "url": res["url"],
                    "type": res["type"],
                    "source_doc": doc["title"],
                })

        return {
            "risk_drivers": deficits,
            "retrieved_documents": retrieved_docs,
            "action_plan": action_plan_days,
            "resources": collected_resources[:6],
            "rag_metadata": {
                "engine": f"ChromaDB Vector Search ({self.model_name} embeddings)",
                "indexed_documents_count": self.collection.count(),
                "top_k_retrieved": len(retrieved_docs),
            },
        }


# Singleton instance
rag_engine = RAGService()
