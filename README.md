# C# Backend Project

This is a beginner-friendly starter project that now includes:

- a very small ASP.NET Core backend
- a matching Angular frontend

The goal is to help me learn how a C# backend and an Angular frontend fit together without too much setup hiding what is going on.

## Why add a frontend?

The frontend is here for a few practical learning reasons:

- to practice Angular with a real API instead of static demo data
- to see how frontend files are structured into routes, components, services, and models
- to learn how a frontend calls a backend endpoint and displays the response
- to get comfortable with a component library through Angular Material
- to grow this repo from one home page into a fuller full-stack practice app later

## What the backend does

The backend currently:

- starts a backend server on `http://localhost:5050`
- returns a simple message from `GET /` so you can confirm the server is running
- returns JSON from `GET /api/status` so the Angular app can prove the connection is working
- returns hardcoded agriculture dashboard data from `GET /api/dashboard` so the frontend can show cards, charts, and field insights without needing a database or API keys

## What the frontend does

The Angular frontend currently:

- starts on `http://localhost:4200`
- shows an agriculture usage dashboard built with Angular Material and Chart.js
- calls `/api/dashboard` for hardcoded analytics data and `/api/status` for backend health
- uses a local proxy so the Angular app can talk to the backend cleanly during development

## Run the backend

```bash
cd /Users/garysmith/Repositories/csharp-backend-project
dotnet run
```

Then open `http://localhost:5050` in your browser if you want to check the backend on its own.

## Run the frontend

Open a second terminal:

```bash
cd /Users/garysmith/Repositories/csharp-backend-project/frontend
npm start
```

Then open `http://localhost:4200`.

## Project files

- `Program.cs` contains the backend setup, the sample route, the API route, and CORS for the Angular dev server
- `AgricultureDashboardResponse.cs` contains the typed response models for the dashboard endpoint
- `frontend/src/app/pages/home` contains the first Angular home page
- `frontend/src/app/services/dashboard.service.ts` contains the dashboard API call
- `frontend/src/app/models/agriculture-dashboard.ts` contains the TypeScript interfaces for the dashboard response
- `frontend/src/app/services/backend-status.service.ts` contains the API call to the backend
- `frontend/src/app/models/backend-status.ts` contains the TypeScript interface for the backend response
- `frontend/proxy.conf.json` forwards `/api` requests to the C# backend during local development
- `Properties/launchSettings.json` sets the localhost port for local backend development
- `.gitignore` ignores backend and frontend build output folders

## Suggested learning path

If you want to explore this step by step:

1. Start the backend and open `http://localhost:5050/api/status`.
2. Open `http://localhost:5050/api/dashboard` and inspect the hardcoded dashboard JSON.
3. Start the frontend and confirm the home page shows the dashboard and the backend status card.
4. Read `home.component.ts` to see how Angular loads data and turns API responses into charts.
5. Read `dashboard.service.ts` and `backend-status.service.ts` to see how the HTTP calls are separated from the page.
6. Change the API response in `Program.cs` and refresh the Angular page to watch the full stack update.
