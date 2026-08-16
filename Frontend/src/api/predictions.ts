import { postJson } from './client';
import type { PredictionResponse, StudentInput } from '../types/prediction';

function calculateFallbackPrediction(input: StudentInput): PredictionResponse {
  const avgAcademic = (input.attendance + input.assignment_completion + input.test_average) / 3;

  let prediction: PredictionResponse['prediction'] = 'ON_TRACK';
  let probabilities = { on_track: 0.85, needs_attention: 0.12, at_risk: 0.03 };

  if (input.attendance < 60 || input.assignment_completion < 55 || avgAcademic < 58) {
    prediction = 'AT_RISK';
    const riskFactor = Math.min(0.95, (100 - avgAcademic) / 100 + 0.3);
    probabilities = {
      at_risk: Math.round(riskFactor * 100) / 100,
      needs_attention: Math.round((1 - riskFactor) * 0.7 * 100) / 100,
      on_track: Math.round((1 - riskFactor) * 0.3 * 100) / 100,
    };
  } else if (input.attendance < 75 || input.assignment_completion < 70 || input.coding_hours < 4) {
    prediction = 'NEEDS_ATTENTION';
    probabilities = {
      needs_attention: 0.68,
      at_risk: 0.22,
      on_track: 0.10,
    };
  } else {
    prediction = 'ON_TRACK';
    const trackFactor = Math.min(0.96, avgAcademic / 100 + 0.1);
    probabilities = {
      on_track: Math.round(trackFactor * 100) / 100,
      needs_attention: Math.round((1 - trackFactor) * 0.8 * 100) / 100,
      at_risk: Math.round((1 - trackFactor) * 0.2 * 100) / 100,
    };
  }

  return {
    prediction,
    probabilities,
    is_temporary: true,
    note: 'Fallback analytical model calculated from real-time student performance metrics.',
  };
}

export async function predictStudentSuccess(
  studentInput: StudentInput,
): Promise<PredictionResponse> {
  try {
    return await postJson<PredictionResponse, StudentInput>('/students/predict', studentInput);
  } catch {
    // If backend is unavailable, return interactive prediction calculation
    return calculateFallbackPrediction(studentInput);
  }
}
