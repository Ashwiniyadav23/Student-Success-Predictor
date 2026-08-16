import { useState, useEffect } from 'react';

import { Header } from './components/Header';
import { PresetsBar, PRESETS } from './components/PresetsBar';
import { MetricsOverview } from './components/MetricsOverview';
import { PredictForm } from './components/PredictForm';
import { PredictionResult } from './components/PredictionResult';
import { PipelineFooter } from './components/PipelineFooter';

import { predictStudentSuccess } from './api/predictions';
import type { PredictionResponse, StudentInput } from './types/prediction';

const initialStudentInput: StudentInput = {
  attendance: 72,
  assignment_completion: 68,
  test_average: 65,
  coding_hours: 5,
  goals_completed: 3,
  projects_completed: 1,
  interview_practice_hours: 2,
};

export default function App() {
  const [formState, setFormState] = useState<StudentInput>(initialStudentInput);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(true);

  // Run initial prediction on load so dashboard shows results immediately!
  useEffect(() => {
    handlePredict(initialStudentInput);
  }, []);

  const handleChangeField = <K extends keyof StudentInput>(field: K, value: number) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePredict = async (inputToPredict: StudentInput = formState) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await predictStudentSuccess(inputToPredict);
      setPredictionResult(result);
      if (result.is_temporary) {
        setIsApiConnected(false);
      } else {
        setIsApiConnected(true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Prediction request failed';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (presetInput: StudentInput) => {
    setFormState(presetInput);
    handlePredict(presetInput);
  };

  const handleReset = () => {
    setFormState(initialStudentInput);
    handlePredict(initialStudentInput);
  };

  return (
    <main className="app-shell">
      <Header isApiConnected={isApiConnected} onReset={handleReset} />

      <PresetsBar onSelectPreset={handleSelectPreset} />

      <MetricsOverview input={formState} />

      <section className="dashboard-main-grid">
        <PredictForm
          formState={formState}
          onChangeField={handleChangeField}
          isSubmitting={isSubmitting}
          onSubmit={() => handlePredict(formState)}
        />

        <PredictionResult
          studentInput={formState}
          result={predictionResult}
          isLoading={isSubmitting}
          errorMessage={errorMessage}
        />
      </section>

      <PipelineFooter />
    </main>
  );
}
