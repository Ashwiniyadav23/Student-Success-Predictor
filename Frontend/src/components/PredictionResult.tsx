import type { PredictionResponse, StudentInput } from '../types/prediction';

type PredictionResultProps = {
  studentInput: StudentInput | null;
  result: PredictionResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
};

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function getRiskTone(prediction: PredictionResponse['prediction']): string {
  if (prediction === 'AT_RISK') {
    return 'High priority';
  }

  if (prediction === 'NEEDS_ATTENTION') {
    return 'Needs attention';
  }

  return 'On track';
}

export function PredictionResult({
  studentInput,
  result,
  isLoading,
  errorMessage,
}: PredictionResultProps) {
  return (
    <div className="result-stack">
      <section className="panel panel-highlight">
        <h2>ML Prediction</h2>
        {isLoading ? <p>Predicting...</p> : null}
        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
        {result ? (
          <div className="prediction-summary">
            <div>
              <p className="prediction-label">Risk Level</p>
              <h3>{result.prediction}</h3>
              <p className="muted-text">{getRiskTone(result.prediction)}</p>
            </div>
            <div>
              <p className="prediction-label">Temporary baseline</p>
              <p className="muted-text">
                This API is currently using a temporary rule-based prediction and will later be replaced by a trained ML model.
              </p>
            </div>
          </div>
        ) : (
          <p className="muted-text">Submit the student form to see a prediction.</p>
        )}
      </section>

      <section className="panel">
        <h2>Probability</h2>
        {result ? (
          <div className="probability-list">
            {Object.entries(result.probabilities).map(([label, value]) => (
              <div key={label} className="probability-row">
                <div className="probability-meta">
                  <span>{label.replace('_', ' ')}</span>
                  <span>{formatPercent(value)}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${value * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-text">Probabilities will appear here after prediction.</p>
        )}
      </section>

      <section className="panel">
        <h2>Main Factors</h2>
        {studentInput ? (
          <ul className="factor-list">
            <li>Attendance: {studentInput.attendance}%</li>
            <li>Assignments: {studentInput.assignment_completion}%</li>
            <li>Test average: {studentInput.test_average}%</li>
            <li>Coding hours: {studentInput.coding_hours} per week</li>
          </ul>
        ) : (
          <p className="muted-text">Main factors will be derived later from AI recommendations.</p>
        )}
      </section>

      <section className="panel">
        <h2>AI Explanation</h2>
        <p className="muted-text">
          This section is reserved for the AI recommendation layer. In later phases, it will explain why the model made its prediction.
        </p>
      </section>

      <section className="panel">
        <h2>7-Day Action Plan</h2>
        <p className="muted-text">
          A personalized action plan will be generated after the AI layer is added.
        </p>
      </section>

      <section className="panel">
        <h2>Recommended Learning Resources</h2>
        <p className="muted-text">
          Learning resources will be recommended after the RAG layer is connected.
        </p>
      </section>
    </div>
  );
}
