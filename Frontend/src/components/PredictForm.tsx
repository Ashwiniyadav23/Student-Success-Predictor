import { useState, type FormEvent } from 'react';

import type { StudentInput } from '../types/prediction';

const initialFormState: StudentInput = {
  attendance: 70,
  assignment_completion: 65,
  test_average: 68,
  coding_hours: 4,
  goals_completed: 3,
  projects_completed: 1,
  interview_practice_hours: 2,
};

type PredictFormProps = {
  isSubmitting: boolean;
  onSubmit: (input: StudentInput) => void;
};

export function PredictForm({ isSubmitting, onSubmit }: PredictFormProps) {
  const [formState, setFormState] = useState<StudentInput>(initialFormState);

  function updateField<K extends keyof StudentInput>(field: K, value: number): void {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(formState);
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <h2>Student Performance</h2>
      <p className="muted-text">
        Enter learning behavior metrics to generate a student success prediction.
      </p>

      <div className="grid-form">
        {(
          [
            ['attendance', 'Attendance %'],
            ['assignment_completion', 'Assignment completion %'],
            ['test_average', 'Test average %'],
            ['coding_hours', 'Coding hours / week'],
            ['goals_completed', 'Goals completed'],
            ['projects_completed', 'Projects completed'],
            ['interview_practice_hours', 'Interview practice hours / week'],
          ] as const
        ).map(([field, label]) => (
          <label key={field} className="field-label">
            <span>{label}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={formState[field]}
              onChange={(event) => updateField(field, Number(event.target.value))}
            />
          </label>
        ))}
      </div>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Predicting...' : 'Predict Student Risk'}
      </button>
    </form>
  );
}
