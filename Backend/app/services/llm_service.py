"""LLM Recommendation Synthesis Engine for Student Success Predictor.

Combines retrieved vector RAG context and student risk metrics to synthesize
personalized, natural-language AI coaching letters and executive summaries.
Supports Google Gemini API, OpenAI API, and a robust offline fallback synthesizer.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings
from app.schemas.student import StudentPredictionInput

logger = logging.getLogger("uvicorn.error")


class LLMService:
    """Large Language Model Service for Contextual RAG Advice Generation."""

    def __init__(self) -> None:
        self.gemini_api_key = settings.gemini_api_key
        self.openai_api_key = settings.openai_api_key
        self.provider = settings.llm_provider.lower()
        self.model = settings.llm_model

    def _build_prompt(
        self,
        student: StudentPredictionInput,
        prediction: str,
        risk_drivers: List[str],
        rag_docs: List[Dict[str, Any]],
    ) -> str:
        """Formulate RAG-augmented prompt for LLM synthesis."""
        docs_text = "\n".join([
            f"- [{doc.get('category', 'general').upper()}] {doc.get('title')}: {doc.get('description')} "
            f"(Action items: {', '.join(doc.get('action_items', []))})"
            for doc in rag_docs
        ])

        drivers_text = "\n".join([f"- {driver}" for driver in risk_drivers])

        return (
            f"You are an expert AI Student Success Coach and Academic Mentor.\n"
            f"Analyze the following student performance profile, risk classification, and vector RAG retrieved knowledge intervention documents to generate a warm, constructive, and highly actionable personal coaching plan.\n\n"
            f"=== STUDENT PROFILE METRICS ===\n"
            f"Attendance Rate: {student.attendance:.1f}%\n"
            f"Assignment Completion: {student.assignment_completion:.1f}%\n"
            f"Test Average: {student.test_average:.1f}%\n"
            f"Weekly Coding Practice: {student.coding_hours} hours/week\n"
            f"Completed Goals: {student.goals_completed}\n"
            f"Portfolio Projects Completed: {student.projects_completed}\n"
            f"Mock Interview Practice: {student.interview_practice_hours} hours/week\n"
            f"Assessed Risk Status: {prediction}\n\n"
            f"=== IDENTIFIED RISK DRIVERS ===\n"
            f"{drivers_text}\n\n"
            f"=== RETRIEVED RAG KNOWLEDGE BASE INTERVENTIONS ===\n"
            f"{docs_text}\n\n"
            f"=== INSTRUCTIONS ===\n"
            f"Provide a structured response containing:\n"
            f"1. EXECUTIVE SUMMARY: A 2-sentence high-level diagnosis of student state.\n"
            f"2. COACHING ADVICE: A 3-paragraph personalized letter directly addressing the student with encouragement, key deficit analysis, and clear guidance based on the retrieved knowledge base documents."
        )

    def _call_gemini_api(self, prompt: str) -> Optional[str]:
        """Query Google Gemini REST API using httpx."""
        if not self.gemini_api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.gemini_api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 800,
            }
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text")
        except Exception as e:
            logger.warning(f"Gemini API call failed, falling back to local synthesis engine: {e}")

        return None

    def _call_openai_api(self, prompt: str) -> Optional[str]:
        """Query OpenAI REST API using httpx."""
        if not self.openai_api_key:
            return None

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are an expert AI Student Success Coach."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 800,
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content")
        except Exception as e:
            logger.warning(f"OpenAI API call failed, falling back to local synthesis engine: {e}")

        return None

    def _generate_fallback_synthesis(
        self,
        student: StudentPredictionInput,
        prediction: str,
        risk_drivers: List[str],
        rag_docs: List[Dict[str, Any]],
    ) -> Dict[str, str]:
        """RAG-augmented heuristic synthesis engine when cloud API is offline or unconfigured."""
        top_doc_title = rag_docs[0]["title"] if rag_docs else "Core Academic Support Plan"
        top_doc_desc = rag_docs[0]["description"] if rag_docs else "Focus on foundational drills and attendance recovery."

        if prediction == "AT_RISK":
            summary = f"Student is classified as AT RISK with key deficits in {risk_drivers[0] if risk_drivers else 'attendance & practice'}. Immediate mentor intervention and structured catchup sprints are required."
            coaching_advice = (
                f"### Urgent Academic & Skills Recovery Plan\n\n"
                f"Dear Student,\n\n"
                f"Your performance metrics indicate critical warning signs that require immediate alignment with your learning mentor. "
                f"Currently, your attendance stands at **{student.attendance:.1f}%** and weekly coding practice is **{student.coding_hours} hrs/wk**. "
                f"To turn this trajectory around, our RAG knowledge engine recommends starting with **{top_doc_title}**: *{top_doc_desc}*\n\n"
                f"**Immediate Priorities:**\n"
                f"1. Schedule a 1-on-1 alignment session with your mentor to clear attendance and assignment backlogs.\n"
                f"2. Commit to a fixed daily 2-hour coding block without distractions.\n"
                f"3. Review core concepts for upcoming quizzes and join peer debug circles."
            )
        elif prediction == "NEEDS_ATTENTION":
            summary = f"Student is meeting baseline metrics but shows mild risk in {risk_drivers[0] if risk_drivers else 'coding hours'}. Targeted guidance recommended to avoid slippage."
            coaching_advice = (
                f"### Academic Consistency & Momentum Boost\n\n"
                f"Dear Student,\n\n"
                f"You are maintaining decent baseline progress across your coursework, but key metrics like **coding hours ({student.coding_hours} hrs/wk)** "
                f"and **interview practice ({student.interview_practice_hours} hrs/wk)** show room for steady improvement. "
                f"Based on vector semantic matching, we recommend focusing on **{top_doc_title}**.\n\n"
                f"**Key Next Steps:**\n"
                f"1. Increase weekly coding practice by 2 additional hours to strengthen problem-solving logic.\n"
                f"2. Submit pending assignments 24 hours prior to deadlines.\n"
                f"3. Begin building mini full-stack capstone projects for your developer portfolio."
            )
        else:
            summary = f"Student is ON TRACK with strong attendance ({student.attendance:.1f}%) and practical consistency. Recommended for advanced capstone projects and leadership peer coaching."
            coaching_advice = (
                f"### Excellence Acceleration & Career Readiness\n\n"
                f"Dear Student,\n\n"
                f"Outstanding job maintaining strong academic performance! With an attendance rate of **{student.attendance:.1f}%** and **{student.projects_completed} completed projects**, "
                f"you are on a solid path toward full-stack mastery. Our RAG engine suggests exploring **{top_doc_title}** to further elevate your skills.\n\n"
                f"**Growth Opportunities:**\n"
                f"1. Tackle advanced system design challenges and unit testing in your repository builds.\n"
                f"2. Lead peer code review sessions for cohort classmates.\n"
                f"3. Refine technical resume and conduct mock interviews on Pramp."
            )

        return {
            "llm_summary": summary,
            "llm_coaching_advice": coaching_advice,
            "llm_provider": "Vector RAG AI Synthesizer (Built-in)",
        }

    def generate_recommendation(
        self,
        student: StudentPredictionInput,
        prediction: str,
        risk_drivers: List[str],
        rag_docs: List[Dict[str, Any]],
    ) -> Dict[str, str]:
        """Main entry point to generate LLM coaching advice via cloud API or local synthesizer."""
        prompt = self._build_prompt(student, prediction, risk_drivers, rag_docs)

        # Try Gemini API if key exists
        if self.gemini_api_key:
            response_text = self._call_gemini_api(prompt)
            if response_text:
                parts = response_text.split("COACHING ADVICE:", 1)
                summary_part = parts[0].replace("EXECUTIVE SUMMARY:", "").strip() if len(parts) > 1 else response_text[:200]
                advice_part = parts[1].strip() if len(parts) > 1 else response_text

                return {
                    "llm_summary": summary_part,
                    "llm_coaching_advice": advice_part,
                    "llm_provider": f"Google Gemini API ({self.model})",
                }

        # Try OpenAI API if key exists
        if self.openai_api_key:
            response_text = self._call_openai_api(prompt)
            if response_text:
                parts = response_text.split("COACHING ADVICE:", 1)
                summary_part = parts[0].replace("EXECUTIVE SUMMARY:", "").strip() if len(parts) > 1 else response_text[:200]
                advice_part = parts[1].strip() if len(parts) > 1 else response_text

                return {
                    "llm_summary": summary_part,
                    "llm_coaching_advice": advice_part,
                    "llm_provider": "OpenAI GPT-3.5 API",
                }

        # Fallback to smart local synthesizer
        return self._generate_fallback_synthesis(student, prediction, risk_drivers, rag_docs)


# Singleton instance
llm_engine = LLMService()
