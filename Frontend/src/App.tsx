import { useState } from 'react';

import { predictStudentSuccess } from './api/predictions';
import { MetricCard } from './components/MetricCard';
import { PredictForm } from './components/PredictForm';
import { PredictionResult } from './components/PredictionResult';
import type { PredictionResponse, StudentInput } from './types/prediction';

export default function App() {
  const [studentInput, setStudentInput] = useState<StudentInput | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePredict(input: StudentInput): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);
    setStudentInput(input);

    try {
      const result = await predictStudentSuccess(input);
      setPredictionResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Prediction request failed';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Student Success Predictor</p>
          <h1>Frontend dashboard for student risk prediction</h1>
          <p className="hero-copy">
            This interface connects to the FastAPI backend and displays the current student performance, ML prediction, and future AI experience sections.
          </p>
        </div>

        <div className="hero-badges">
          <MetricCard label="Backend" value="FastAPI" description="Temporary prediction API is connected." />
          <MetricCard label="Frontend" value="React + TypeScript" description="Clean UI for the prediction workflow." />
        </div>
      </header>

      <section className="dashboard-grid">
        <PredictForm isSubmitting={isSubmitting} onSubmit={handlePredict} />
        <PredictionResult
          studentInput={studentInput}
          result={predictionResult}
          isLoading={isSubmitting}
          errorMessage={errorMessage}
        />
      </section>

      <section className="panel architecture-panel">
        <h2>Prediction Flow</h2>
        <ol className="flow-list">
          <li>Student Performance</li>
          <li>ML Prediction</li>
          <li>Risk Level</li>
          <li>Probability</li>
          <li>Main Factors</li>
          <li>AI Explanation</li>
          <li>7-Day Action Plan</li>
          <li>Recommended Learning Resources</li>
        </ol>
      </section>
    </main>
  );
}
