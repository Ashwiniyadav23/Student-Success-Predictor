import { postJson } from './client';
import type { PredictionResponse, StudentInput, StudentProfile } from '../types/prediction';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '/api';

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'STU-1001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@navgurukul.org',
    attendance: 94.5,
    assignment_completion: 92.0,
    test_average: 88.5,
    coding_hours: 8.5,
    goals_completed: 5,
    projects_completed: 3,
    interview_practice_hours: 4.5,
    prediction: 'ON_TRACK',
    attendance_records: [
      { date: '2026-08-15', status: 'PRESENT', session_name: 'Full-Stack Development Lab', notes: 'Completed React component exercise ahead of time.' },
      { date: '2026-08-14', status: 'PRESENT', session_name: 'Algorithms & Problem Solving', notes: 'Active participation in dynamic programming live debug.' },
      { date: '2026-08-13', status: 'PRESENT', session_name: 'System Architecture Overview', notes: 'Submitted API architecture diagram on time.' },
      { date: '2026-08-12', status: 'LATE', session_name: 'Database Optimization & SQL', notes: 'Arrived 10 mins late due to network glitch; caught up quickly.' },
      { date: '2026-08-11', status: 'PRESENT', session_name: 'Mock Interview Session', notes: 'Solved 2 Medium LeetCode problems with clean explanation.' }
    ]
  },
  {
    id: 'STU-1002',
    name: 'Priya Patel',
    email: 'priya.patel@navgurukul.org',
    attendance: 72.0,
    assignment_completion: 68.0,
    test_average: 65.0,
    coding_hours: 4.5,
    goals_completed: 3,
    projects_completed: 1,
    interview_practice_hours: 2.0,
    prediction: 'NEEDS_ATTENTION',
    attendance_records: [
      { date: '2026-08-15', status: 'PRESENT', session_name: 'Full-Stack Development Lab', notes: 'Worked on backend router integration.' },
      { date: '2026-08-14', status: 'ABSENT', session_name: 'Algorithms & Problem Solving', notes: 'Unexcused absence. Mentor sent follow-up ping.' },
      { date: '2026-08-13', status: 'PRESENT', session_name: 'System Architecture Overview', notes: 'Attended session, needs revision on microservices concept.' },
      { date: '2026-08-12', status: 'LATE', session_name: 'Database Optimization & SQL', notes: 'Arrived 20 mins late; assignment incomplete.' },
      { date: '2026-08-11', status: 'PRESENT', session_name: 'Mock Interview Session', notes: 'Struggled with array manipulation question.' }
    ]
  },
  {
    id: 'STU-1003',
    name: 'Rohan Verma',
    email: 'rohan.verma@navgurukul.org',
    attendance: 48.0,
    assignment_completion: 52.0,
    test_average: 45.0,
    coding_hours: 1.5,
    goals_completed: 1,
    projects_completed: 0,
    interview_practice_hours: 0.5,
    prediction: 'AT_RISK',
    attendance_records: [
      { date: '2026-08-15', status: 'ABSENT', session_name: 'Full-Stack Development Lab', notes: 'Did not log into morning session.' },
      { date: '2026-08-14', status: 'ABSENT', session_name: 'Algorithms & Problem Solving', notes: 'Reported sick leave.' },
      { date: '2026-08-13', status: 'PRESENT', session_name: 'System Architecture Overview', notes: 'Logged in late, low engagement during Q&A.' },
      { date: '2026-08-12', status: 'ABSENT', session_name: 'Database Optimization & SQL', notes: 'Missed core SQL join workshop.' },
      { date: '2026-08-11', status: 'LATE', session_name: 'Mock Interview Session', notes: 'Arrived at end of session.' }
    ]
  },
  {
    id: 'STU-1004',
    name: 'Ananya Sen',
    email: 'ananya.sen@navgurukul.org',
    attendance: 96.0,
    assignment_completion: 98.0,
    test_average: 94.0,
    coding_hours: 10.0,
    goals_completed: 6,
    projects_completed: 4,
    interview_practice_hours: 5.0,
    prediction: 'ON_TRACK',
    attendance_records: [
      { date: '2026-08-15', status: 'PRESENT', session_name: 'Full-Stack Development Lab', notes: 'Led group discussion on state management.' },
      { date: '2026-08-14', status: 'PRESENT', session_name: 'Algorithms & Problem Solving', notes: 'Scored top marks in speed coding challenge.' },
      { date: '2026-08-13', status: 'PRESENT', session_name: 'System Architecture Overview', notes: 'Submitted high-level design doc.' },
      { date: '2026-08-12', status: 'PRESENT', session_name: 'Database Optimization & SQL', notes: 'Optimized multi-table query performance.' },
      { date: '2026-08-11', status: 'PRESENT', session_name: 'Mock Interview Session', notes: 'Excellent performance on systemic interview trial.' }
    ]
  },
  {
    id: 'STU-1005',
    name: 'Vikram Singh',
    email: 'vikram.singh@navgurukul.org',
    attendance: 66.5,
    assignment_completion: 71.0,
    test_average: 64.0,
    coding_hours: 3.8,
    goals_completed: 2,
    projects_completed: 1,
    interview_practice_hours: 1.5,
    prediction: 'NEEDS_ATTENTION',
    attendance_records: [
      { date: '2026-08-15', status: 'PRESENT', session_name: 'Full-Stack Development Lab', notes: 'Completed baseline setup.' },
      { date: '2026-08-14', status: 'LATE', session_name: 'Algorithms & Problem Solving', notes: 'Late by 15 mins.' },
      { date: '2026-08-13', status: 'ABSENT', session_name: 'System Architecture Overview', notes: 'Missed architectural review session.' },
      { date: '2026-08-12', status: 'PRESENT', session_name: 'Database Optimization & SQL', notes: 'Participated in hands-on queries.' },
      { date: '2026-08-11', status: 'PRESENT', session_name: 'Mock Interview Session', notes: 'Needs more practice on data structures.' }
    ]
  }
];

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

export async function fetchStudents(): Promise<StudentProfile[]> {
  try {
    const res = await fetch(`${apiBaseUrl}/students`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return await res.json();
  } catch {
    return INITIAL_STUDENT_PROFILES;
  }
}

export async function predictStudentSuccess(
  studentInput: StudentInput,
): Promise<PredictionResponse> {
  try {
    return await postJson<PredictionResponse, StudentInput>('/students/predict', studentInput);
  } catch {
    return calculateFallbackPrediction(studentInput);
  }
}
