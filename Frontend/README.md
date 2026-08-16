# Student Success Predictor Frontend

A React + TypeScript frontend for the Student Success Predictor project.

## What this frontend does

- Displays a student performance form
- Sends the form data to the FastAPI backend
- Shows the prediction result
- Shows class probabilities
- Provides placeholder areas for future AI explanation and learning resources

## Project structure

- `src/App.tsx` — main dashboard layout
- `src/api/` — backend API client
- `src/components/` — UI components
- `src/types/` — TypeScript types

## Setup

1. Create a frontend environment file:
   - copy `.env.example` to `.env`
2. Install dependencies:
   - `npm install`
3. Run the app:
   - `npm run dev`

## Environment variables

- `VITE_API_URL` — backend URL, for example `http://localhost:8000`

## Backend requirement

The backend should be running before you use the prediction form.

## Notes

This frontend currently connects to the temporary prediction endpoint from Phase 1. The ML-backed API will replace it later.
