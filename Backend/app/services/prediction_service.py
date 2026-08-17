"""Temporary baseline prediction logic for Phase 1.

This is intentionally rule-based only for initial API testing. The real student
success predictor will be replaced with a trained model in later phases.
"""

from __future__ import annotations

from math import exp

from app.schemas.prediction import PredictionProbabilities, PredictionResponse
from app.schemas.student import StudentPredictionInput


CLASS_CENTERS = {
	"AT_RISK": 25.0,
	"NEEDS_ATTENTION": 55.0,
	"ON_TRACK": 82.0,
}


def _normalize_feature_score(student: StudentPredictionInput) -> float:
	"""Convert the student profile into a 0-100 readiness score."""

	coding_score = min(student.coding_hours * 10.0, 100.0)
	goals_score = min(student.goals_completed * 20.0, 100.0)
	projects_score = min(student.projects_completed * 25.0, 100.0)
	interview_score = min(student.interview_practice_hours * 10.0, 100.0)

	return (
		0.25 * student.attendance
		+ 0.20 * student.assignment_completion
		+ 0.20 * student.test_average
		+ 0.15 * coding_score
		+ 0.08 * goals_score
		+ 0.08 * projects_score
		+ 0.04 * interview_score
	)


def _softmax_from_distances(score: float) -> PredictionProbabilities:
	distances = {
		label: abs(score - center)
		for label, center in CLASS_CENTERS.items()
	}
	raw_scores = {label: exp(-distance / 12.0) for label, distance in distances.items()}
	total = sum(raw_scores.values())
	return PredictionProbabilities(
		at_risk=raw_scores["AT_RISK"] / total,
		needs_attention=raw_scores["NEEDS_ATTENTION"] / total,
		on_track=raw_scores["ON_TRACK"] / total,
	)


def predict_student_success(student: StudentPredictionInput) -> PredictionResponse:
	"""Return a temporary rule-based prediction for the given student."""

	score = _normalize_feature_score(student)
	probabilities = _softmax_from_distances(score)

	probability_map = {
		"AT_RISK": probabilities.at_risk,
		"NEEDS_ATTENTION": probabilities.needs_attention,
		"ON_TRACK": probabilities.on_track,
	}
	prediction = max(probability_map, key=probability_map.get)

	return PredictionResponse(prediction=prediction, probabilities=probabilities)
