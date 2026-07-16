# CivicLens AI

AI-powered community intelligence for safer, more responsive cities.

## Problem

Cities receive fragmented reports about potholes, broken streetlights, illegal dumping, water leaks, blocked drains, and unsafe public spaces. These reports often lack severity, location intelligence, duplicate detection, and clear next actions.

## Solution

CivicLens AI turns citizens into real-time civic sensors. A user reports a problem with a photo, CivicLens AI classifies the issue, estimates community impact, recommends an action plan, checks for duplicates, and places the report on a live OpenStreetMap dashboard.

## Hackathon Demo Flow

1. Open the app.
2. Click **Try Demo Report**.
3. Watch the AI scanning state.
4. Review the Community Impact Score, classification confidence, civic impact factors, and AI Action Plan.
5. Create the report and see it appear on the map.
6. Explore dashboard insights and community verification cards.

No login or API key is required for demo mode.

## Key Features

- Premium responsive landing page and reporting workflow.
- Demo mode that works without OpenAI credentials.
- OpenAI-powered civic analysis with deterministic fallback intelligence.
- Community Impact Score from 0-100.
- Safety, accessibility, environmental, urgency, and people-affected signals.
- AI Action Plan with priority, responsible department, resolution estimate, consequences, and recommended action.
- Duplicate detection for nearby similar reports.
- Leaflet + OpenStreetMap live map with severity markers and user location.
- Community verification, confidence, confirmations, and evidence counts.
- CivicLens AI Insight Engine for predictive community recommendations.
- Prisma schema ready for Supabase/PostgreSQL persistence.

## AI Capabilities

CivicLens AI asks the model for structured JSON containing:

- Issue classification and category.
- Detection confidence.
- Community Impact Score.
- Impact reasoning and risk factors.
- Priority level and responsible department.
- Estimated resolution time.
- Potential consequences if ignored.
- Recommended immediate action.

If `OPENAI_API_KEY` is missing or the model call fails, the app safely falls back to realistic demo intelligence.

## Architecture

- **Frontend:** Next.js App Router, TypeScript, React, Tailwind CSS, Framer Motion, React Hook Form.
- **API:** REST routes under `app/api` for analysis, report CRUD, and status updates.
- **AI:** OpenAI Responses API with Zod validation and fallback demo output.
- **Data:** Prisma schema for Supabase/PostgreSQL; in-memory demo store for local judging.
- **Maps:** React Leaflet, Leaflet, OpenStreetMap, browser geolocation.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` and click **Try Demo Report**.

## Environment Variables

```bash
OPENAI_API_KEY=
DATABASE_URL=
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

## Demo Data

The bundled demo data includes realistic reports for:

- Large pothole on a residential road.
- Overflowing public garbage bins.
- Broken streetlight at a bus stop.
- Water leak flooding a sidewalk.

## Submission Notes

CivicLens AI is designed so a judge can understand the value in under 30 seconds: take a photo, let AI understand the civic issue, score its impact, generate an action plan, place it on a map, and help communities respond faster.
