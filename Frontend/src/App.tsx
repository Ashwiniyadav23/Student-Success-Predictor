import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Header } from './components/Header';
import { StudentSelectorBar } from './components/StudentSelectorBar';
import { StudentAttendanceTable } from './components/StudentAttendanceTable';
import { PresetsBar } from './components/PresetsBar';
import { MetricsOverview } from './components/MetricsOverview';
import { PredictForm } from './components/PredictForm';
import { PredictionResult } from './components/PredictionResult';
import { PipelineFooter } from './components/PipelineFooter';

import { fetchStudents, predictStudentSuccess } from './api/predictions';
import type { PredictionResponse, StudentInput, StudentProfile } from './types/prediction';

export default function App() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [formState, setFormState] = useState<StudentInput>({
    attendance: 94.5,
    assignment_completion: 92.0,
    test_average: 88.5,
    coding_hours: 8.5,
    goals_completed: 5,
    projects_completed: 3,
    interview_practice_hours: 4.5,
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(true);

  // Fetch initial student-wise records on mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchStudents();
      setStudents(data);
      if (data.length > 0) {
        handleSelectStudent(data[0]);
      }
    }
    loadData();
  }, []);

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
    const input: StudentInput = {
      attendance: student.attendance,
      assignment_completion: student.assignment_completion,
      test_average: student.test_average,
      coding_hours: student.coding_hours,
      goals_completed: student.goals_completed,
      projects_completed: student.projects_completed,
      interview_practice_hours: student.interview_practice_hours,
    };
    setFormState(input);
    handlePredict(input);
  };

  const handleChangeField = <K extends keyof StudentInput>(field: K, value: number) => {
    setFormState((prev) => {
      const updated = { ...prev, [field]: value };
      if (selectedStudent) {
        setSelectedStudent({
          ...selectedStudent,
          [field]: value,
        });
      }
      return updated;
    });
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
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        ...presetInput,
      });
    }
    handlePredict(presetInput);
  };

  const handleReset = () => {
    if (students.length > 0) {
      handleSelectStudent(students[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <Header isApiConnected={isApiConnected} onReset={handleReset} />

        {students.length > 0 && (
          <StudentSelectorBar
            students={students}
            selectedStudentId={selectedStudent?.id || ''}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {selectedStudent && <StudentAttendanceTable student={selectedStudent} />}

        <PresetsBar onSelectPreset={handleSelectPreset} />

        <MetricsOverview input={formState} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <PredictForm
              formState={formState}
              onChangeField={handleChangeField}
              isSubmitting={isSubmitting}
              onSubmit={() => handlePredict(formState)}
            />
          </div>

          <div className="lg:col-span-7 h-full">
            <PredictionResult
              studentInput={formState}
              result={predictionResult}
              isLoading={isSubmitting}
              errorMessage={errorMessage}
            />
          </div>
        </section>

        <PipelineFooter />
      </main>
    </div>
  );
}

