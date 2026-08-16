import { postJson } from './client';
import type { PredictionResponse, StudentInput } from '../types/prediction';

export function predictStudentSuccess(
  studentInput: StudentInput,
): Promise<PredictionResponse> {
  return postJson<PredictionResponse, StudentInput>('/students/predict', studentInput);
}
