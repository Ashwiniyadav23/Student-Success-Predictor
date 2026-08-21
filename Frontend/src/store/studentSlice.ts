import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentProfile } from '../types/prediction';
import { fetchStudents } from '../api/predictions';

export type StudentState = {
  students: StudentProfile[];
  selectedStudentId: string | null;
  searchQuery: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: StudentState = {
  students: [],
  selectedStudentId: null,
  searchQuery: '',
  status: 'idle',
  error: null,
};

export const loadStudents = createAsyncThunk('student/loadStudents', async () => {
  return await fetchStudents();
});

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedStudentId: (state, action: PayloadAction<string | null>) => {
      state.selectedStudentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadStudents.fulfilled, (state, action: PayloadAction<StudentProfile[]>) => {
        state.status = 'succeeded';
        state.students = action.payload;
        if (!state.selectedStudentId && action.payload.length > 0) {
          state.selectedStudentId = action.payload[0].id;
        }
      })
      .addCase(loadStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load students';
      });
  },
});

export const { setSearchQuery, setSelectedStudentId } = studentSlice.actions;
export default studentSlice.reducer;
