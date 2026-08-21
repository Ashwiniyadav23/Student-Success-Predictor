import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import { UIProvider } from './context/UIContext';

import { Header } from './components/Header';
import { StudentSelectorBar } from './components/StudentSelectorBar';
import { StudentAttendanceTable } from './components/StudentAttendanceTable';
import { PresetsBar } from './components/PresetsBar';
import { MetricsOverview } from './components/MetricsOverview';
import { PredictForm } from './components/PredictForm';
import { PredictionResult } from './components/PredictionResult';
import { PipelineFooter } from './components/PipelineFooter';
import { AmbientBackground } from './components/AmbientBackground';
import { ToastContainer } from './components/ToastContainer';

import { fetchStudents } from './api/predictions';
import { loadStudents, setSelectedStudentId } from './store/studentSlice';
import { setStudentInput, fetchPrediction } from './store/predictionSlice';
import type { StudentInput, StudentProfile } from './types/prediction';

function MainDashboard() {
  const dispatch = useAppDispatch();
  const students = useAppSelector((state) => state.student.students);
  const selectedStudentId = useAppSelector((state) => state.student.selectedStudentId);
  const predictionInput = useAppSelector((state) => state.prediction.input);
  const isSubmitting = useAppSelector((state) => state.prediction.status === 'loading');
  const predictionResult = useAppSelector((state) => state.prediction.result);
  const errorMessage = useAppSelector((state) => state.prediction.error);

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Load students on mount via Redux Async Thunk
  useEffect(() => {
    dispatch(loadStudents());
  }, [dispatch]);

  // Sync selected student profile
  useEffect(() => {
    if (students.length > 0) {
      const active = students.find((s) => s.id === selectedStudentId) || students[0];
      setSelectedStudent(active);
    }
  }, [students, selectedStudentId]);

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
    dispatch(setSelectedStudentId(student.id));

    const input: StudentInput = {
      attendance: student.attendance,
      assignment_completion: student.assignment_completion,
      test_average: student.test_average,
      coding_hours: student.coding_hours,
      goals_completed: student.goals_completed,
      projects_completed: student.projects_completed,
      interview_practice_hours: student.interview_practice_hours,
    };

    dispatch(setStudentInput(input));
    dispatch(fetchPrediction(input));
  };

  const handleSelectPreset = (presetInput: StudentInput) => {
    dispatch(setStudentInput(presetInput));
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        ...presetInput,
      });
    }
    dispatch(fetchPrediction(presetInput));
  };

  const handleReset = () => {
    if (students.length > 0) {
      handleSelectStudent(students[0]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 overflow-x-hidden">
      {/* Context API & Framer Motion Ambient Background */}
      <AmbientBackground />

      {/* Context API Toast Notifications */}
      <ToastContainer />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <Header isApiConnected={true} onReset={handleReset} />

        {students.length > 0 && (
          <StudentSelectorBar
            students={students}
            selectedStudentId={selectedStudentId || ''}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {selectedStudent && <StudentAttendanceTable student={selectedStudent} />}

        <PresetsBar onSelectPreset={handleSelectPreset} />

        <MetricsOverview input={predictionInput} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <PredictForm
              formState={predictionInput}
              isSubmitting={isSubmitting}
              onSubmit={() => dispatch(fetchPrediction(predictionInput))}
            />
          </div>

          <div className="lg:col-span-7 h-full">
            <PredictionResult
              studentInput={predictionInput}
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

export default function App() {
  return (
    <Provider store={store}>
      <UIProvider>
        <MainDashboard />
      </UIProvider>
    </Provider>
  );
}
