# Triage Frontend

Standalone React/Vite frontend for the triage API in `prognosis-classifier`.

## Included triage files

- `src/components/TriageRunDialog.tsx` — validates and submits months-back and patient-limit settings
- `src/components/TriageDashboard.tsx` — composes the triage page and API workflow
- `src/components/TriageProgress.tsx` — displays backend progress
- `src/components/PatientTable.tsx` — displays structured patient classifications
- `src/hooks/useTriageStatus.ts` — polls triage progress every two seconds
- `src/lib/api.ts` — backend API client and endpoint contract
- `src/types/clinical.ts` — patient classification types
- `src/components/ui/*` — UI primitives required by the run dialog

The repository intentionally excludes prognosis, performance, query-widget, and unrelated clinical dashboard screens.

## Run locally

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:5173>.

The backend must be running and must allow the frontend origin in its CORS configuration. The frontend does not connect directly to MongoDB.

## Backend URL

Set the backend URL with `.env.local` when needed:

```env
VITE_API_URL=http://localhost:8013
```

If the variable is not provided, the frontend defaults to `http://localhost:8013`.

## Backend contract

The frontend currently calls:

```text
POST /api/triage/run
GET  /api/triage/progress
GET  /api/triage/status
GET  /api/patients
```

## Build and preview

```bash
npm run build
npm run preview
```

Deploy the generated `dist` directory as a static site using Nginx, S3/CloudFront, Vercel, or another static hosting provider. Configure the backend CORS allow-list for the deployed frontend domain. Do not put MongoDB, Vertex AI, or service-account credentials in this repository.
