export type AttendanceRecord = {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  session_name: string;
  notes?: string;
};

export type StudentInput = {
  attendance: number;
  assignment_completion: number;
  test_average: number;
  coding_hours: number;
  goals_completed: number;
  projects_completed: number;
  interview_practice_hours: number;
};

export type StudentProfile = StudentInput & {
  id: string;
  name: string;
  email: string;
  prediction: PredictionLabel;
  attendance_records: AttendanceRecord[];
};

export type PredictionLabel = 'AT_RISK' | 'NEEDS_ATTENTION' | 'ON_TRACK';

export type PredictionProbabilities = {
  at_risk: number;
  needs_attention: number;
  on_track: number;
};

export type RAGDocument = {
  id: string;
  category: string;
  title: string;
  description: string;
  relevance_score: number;
  action_items: string[];
};

export type RAGActionPlanDay = {
  day: number;
  task: string;
};

export type RAGResource = {
  name: string;
  url: string;
  type: string;
  source_doc?: string;
};

export type RAGRecommendation = {
  risk_drivers: string[];
  retrieved_documents: RAGDocument[];
  action_plan: RAGActionPlanDay[];
  resources: RAGResource[];
  rag_metadata: {
    engine: string;
    indexed_documents_count: number;
    top_k_retrieved: number;
  };
};

export type PredictionResponse = {
  prediction: PredictionLabel;
  probabilities: PredictionProbabilities;
  is_temporary?: boolean;
  note?: string;
  rag_recommendations?: RAGRecommendation;
};
