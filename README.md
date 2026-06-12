# Multimodality-Based ICU Patient Condition Monitoring System

A full-stack ICU Monitoring System with real-time dashboard, multimodal ML risk prediction, and retrospective analysis.

Repository: https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring

## Overview
- FastAPI backend with SQLite (or PostgreSQL) and SQLAlchemy models
- Multimodal ML: Vitals LSTM + ClinicalBERT encoder + Fusion network
- React + Tailwind + Recharts frontend dashboard
- WebSocket streaming of live vitals
- APScheduler for periodic predictions and daily batch
- Docker-compose for deployment

## Features
- **Real-time dashboard** with vitals charts and risk badges
- **Patients list** with latest vitals and risk
- **Patient detail** with live vitals, on-demand prediction, and risk timeline
- **Alerts** for high-risk patients
- **Retrospective analysis** via risk trajectory visualization

## Screenshots (ASCII placeholders)
```
+----------------------------- ICU Dashboard -----------------------------+
|  Patients: 5  |  High risk: 1  |  Avg risk: 37%                        |
| Alerts: [ Patient 3 - High risk 82% ]                                   |
|                                                                         |
| [HR/SBP/DBP/SpO2/RR/Temp Line Chart..................................] |
|                                                                         |
| [Risk Timeline Area Chart............................................] |
+-------------------------------------------------------------------------+
```

## Getting Started (Local)

### Backend
1. Python 3.11 recommended
2. Install deps:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run server:
   ```bash
   uvicorn backend.app:app --reload --port 8000
   ```
4. API root: http://localhost:8000

### Frontend
1. Node.js 18+
2. Install deps:
   ```bash
   cd frontend && npm install
   ```
3. Run dev:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

### ML Train / Predict
- Quick train (heuristic labels):
  ```bash
  python -m backend.ml.train_model
  ```
- Predict all (scheduler auto-runs too):
  ```bash
  python - <<'PY'
  import anyio
  from backend.ml.predict import predict_all_patients
  anyio.run(predict_all_patients)
  PY
  ```

## API
- See docs/api.md for full listing.

## Deployment

### Docker Compose
```bash
docker compose up --build
```
- Frontend: http://localhost:8080
- Backend: http://localhost:8000

### Railway
- Create new project from repo
- Add two services:
  - Backend: Dockerfile `backend/Dockerfile`, expose 8000
  - Frontend: Dockerfile `frontend/Dockerfile`, expose 80
- Set environment for backend: `DATABASE_URL`, `BACKEND_CORS_ORIGINS`
- Map a custom domain if desired.

### Render
- Create Web Service for backend from `backend/Dockerfile` (port 8000)
- Create Static Site or Docker Web Service for frontend from `frontend/Dockerfile` (port 80)
- Set environment vars as above

## Clinical Interpretation
- **Risk levels**: low (<40%), medium (40–69%), high (≥70%)
- **Early warnings**: High risk triggers alerts; consider escalation
- **24–36h window**: Predictions reflect risk of deterioration in the next 24–36 hours
- **Multimodal reasoning**: Vitals temporal patterns (LSTM) fused with clinical note semantics (ClinicalBERT)

## Project Structure
```
## Project Structure

```text
Multimodal-ICU-Patient-Monitoring/
│
├── icu_system/
│   ├── backend/
│   │   ├── app.py
│   │   ├── config.py
│   │   ├── requirements.txt
│   │   │
│   │   ├── database/
│   │   │   ├── db.py
│   │   │   ├── seed_data.py
│   │   │   └── migrations/
│   │   │       └── 001_init.sql
│   │   │
│   │   ├── ml/
│   │   │   ├── train_model.py
│   │   │   ├── retrain.py
│   │   │   ├── preprocess.py
│   │   │   ├── predict.py
│   │   │   └── checkpoints/
│   │   │
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── nginx.conf
│   │
│   ├── docs/
│   │   ├── api.md
│   │   └── deployment.md
│   │
│   ├── docker-compose.yml
│   └── README.md
│
├── package-lock.json
├── .gitignore
└── LICENSE
```
