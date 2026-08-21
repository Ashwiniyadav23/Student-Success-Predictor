import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentInput, PredictionResponse } from '../types/prediction';
import { predictStudentSuccess } from '../api/predictions';

export const DEFAULT_STUDENT_INPUT: StudentInput = {
  attendance: 85,
  assignment_completion: 80,
  test_average: 78,
  coding_hours: 6,
  goals_completed: 4,
  projects_completed: 2,
  interview_practice_hours: 3,
};

export type PredictionState = {
  input: StudentInput;
  result: PredictionResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  activeTab: 'llm_advice' | 'probabilities' | 'factors' | 'action_plan' | 'resources';
};

const initialState: PredictionState = {
  input: DEFAULT_STUDENT_INPUT,
  result: null,
  status: 'idle',
  error: null,
  activeTab: 'llm_advice',
};

// Async Thunk for executing student success prediction
export const fetchPrediction = createAsyncThunk(
  'prediction/fetchPrediction',
  async (input: StudentInput, { rejectWithValue }) => {
    try {
      return await predictStudentSuccess(input);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Prediction request failed';
      return rejectWithValue(message);
    }
  }
);

export const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    setInputField: <K extends keyof StudentInput>(
      state: PredictionState,
      action: PayloadAction<{ field: K; value: number }>
    ) => {
      state.input[action.payload.field] = action.payload.value;
    },
    setStudentInput: (state, action: PayloadAction<StudentInput>) => {
      state.input = action.payload;
    },
    resetInputState: (state) => {
      state.input = DEFAULT_STUDENT_INPUT;
      state.result = null;
      state.status = 'idle';
      state.error = null;
      state.activeTab = 'llm_advice';
    },
    setActiveTab: (
      state,
      action: PayloadAction<'llm_advice' | 'probabilities' | 'factors' | 'action_plan' | 'resources'>
    ) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrediction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPrediction.fulfilled, (state, action: PayloadAction<PredictionResponse>) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(fetchPrediction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to predict student success';
      });
  },
});

export const { setInputField, setStudentInput, resetInputState, setActiveTab } = predictionSlice.actions;
export default predictionSlice.reducer;
