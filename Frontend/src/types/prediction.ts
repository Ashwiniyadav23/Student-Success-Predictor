export type StudentInput = {
  attendance: number;
  assignment_completion: number;
  test_average: number;
  coding_hours: number;
  goals_completed: number;
  projects_completed: number;
  interview_practice_hours: number;
};

export type PredictionLabel = 'AT_RISK' | 'NEEDS_ATTENTION' | 'ON_TRACK';

export type PredictionProbabilities = {
  at_risk: number;
  needs_attention: number;
  on_track: number;
};

export type PredictionResponse = {
  prediction: PredictionLabel;
  probabilities: PredictionProbabilities;
  is_temporary?: boolean;
  note?: string;
};
