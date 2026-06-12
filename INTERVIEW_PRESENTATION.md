# Multimodality-Based ICU Patient Condition Monitoring — Interview Presentation

This document is an interview-ready summary of the Multimodality ICU Patient Condition Monitoring System. It consolidates architecture, backend and frontend flows, ML pipeline details, demo commands, common interview questions and suggested answers, and next steps.

**Repository paths referenced**
- Backend root: `icu_system/backend/`
- Frontend root: `icu_system/frontend/`
- Main app entry (backend): `icu_system/backend/app.py`
- Prediction endpoint: `icu_system/backend/routes/predictions.py`
- ML code: `icu_system/backend/ml/`
- Database config: `icu_system/backend/database/db.py`
- Pydantic schemas: `icu_system/backend/utils/schemas.py`
- Frontend router: `icu_system/frontend/src/main.jsx`
- API client: `icu_system/frontend/src/shared/api.js`
- Dashboard & charts: `icu_system/frontend/src/pages/Dashboard.jsx`, `icu_system/frontend/src/components/VitalsChart.jsx`

---

**Overview**
- Purpose: Real-time ICU monitoring that fuses physiological vitals and clinical notes to predict patient risk and surface alerts to clinicians.
- Main components: Backend API + ML (FastAPI, SQLAlchemy, PyTorch) and Frontend UI (React + Vite + Recharts). Docker compose exists for integrated runs: `icu_system/docker-compose.yml`.

---

**High-level architecture**
- Clients (browser, devices) ↔ Frontend (React) ↔ Backend (FastAPI) ↔ Database (SQLite by default) and ML modules (PyTorch).
- Background scheduler triggers batch predictions; WebSocket/alerts push notifications to connected frontends.

---

**Backend — detailed process**

1. Startup (see `icu_system/backend/app.py`)
   - FastAPI app created and CORS configured.
   - Routers included: `auth`, `patients`, `predictions`, `dashboard`, `alerts`, `ws`, `analytics`.
   - On `startup`: SQLAlchemy `Base.metadata.create_all(bind=engine)` creates DB tables; `seed()` populates sample data (`database/seed_data.py`); `start_scheduler()` starts background scheduled tasks.

2. Database layer (see `icu_system/backend/database/db.py`)
   - Uses SQLAlchemy `engine`, `SessionLocal`, and `declarative_base()`.
   - `get_db()` yields a DB session per request.
   - Development uses SQLite by default; connection args handle Windows paths.

3. Prediction flow (endpoint + ML integration)
   - Endpoint: `POST /predict/{patient_id}` implemented in `icu_system/backend/routes/predictions.py`.
   - Endpoint obtains DB session via `get_db()`, checks patient, then calls `predict_patient(db, patient_id)` in `icu_system/backend/ml/predict.py`.
   - Current behavior: `predict_patient()` uses a fast heuristic `_heuristic_prediction()` (score computed from latest `Vitals`) and persists a `Prediction` row (`icu_system/backend/models/prediction.py`). The ML inference code is implemented but guarded/commented-out to avoid synchronous blocking on model downloads on startup.
   - Predictions are returned as Pydantic model `PredictionBase` (`icu_system/backend/utils/schemas.py`).

4. Scheduler & Alerts
   - `predict_all_patients()` in `icu_system/backend/ml/predict.py` can be scheduled to run periodically and persist predictions for all patients.
   - Alerts logic watches predictions crossing thresholds and uses WebSocket routes (`routes/ws.py`) to push alerts to connected clients.

5. Auth
   - Auth utilities and routes are in `utils/auth.py`; frontend stores token in `localStorage` and `frontend/src/shared/api.js` injects `Authorization: Bearer {token}` header.

---

**Machine Learning pipeline**

1. Inputs
   - Time-series vitals: heart rate, systolic/diastolic BP, SpO2, respiratory rate, temperature — recorded in `Vitals` model.
   - Clinical notes: text from latest note per patient.

2. Preprocessing
   - `preprocess.py` builds fixed-length sequences for vitals (padding or truncating), and `latest_note_text` returns the most recent note text.
   - Text is encoded with `ClinicalBERTEncoder` (a small wrapper for a clinical language model) to get embeddings.

3. Model architecture (conceptual)
   - `CombinedModel` takes a vitals sequence (tensor) and a text embedding and returns a risk probability.
   - Actual module implementations are in `icu_system/backend/ml/models.py`.

4. Training (`icu_system/backend/ml/train_model.py`)
   - `ICUTrainDataset` composes dataset items of (padded vitals sequence, note embedding, label).
   - Labels for this prototype are heuristic-derived from vitals (rule-based). Loss: `BCELoss`, optimizer: Adam. Saves model checkpoint to `backend/ml/checkpoints/model.pt`.
   - Run training locally with the script entry: `python backend/ml/train_model.py` (see below for commands).

5. Inference (`icu_system/backend/ml/predict.py`)
   - `_load_models()` loads weights from `backend/ml/checkpoints/model.pt` and initializes `ClinicalBERTEncoder`.
   - Synchronous model loading can be slow (HF weights), so the repo uses a heuristic fallback and notes TODOs to make loading fully asynchronous or move inference to a separate service. A `ThreadPoolExecutor` is present for offloading some tasks.
   - Prediction results persisted with `model_version` metadata.

6. Considerations
   - Improve labels by clinician annotation or outcome-linked supervised labels.
   - Production: use a dedicated inference service (GPU-backed), model versioning, A/B rollouts and monitoring.

---

**Frontend — detailed process**

1. Router & auth (see `icu_system/frontend/src/main.jsx`)
   - React Router defines routes and `RequireAuth` guard checks `localStorage.token`.

2. App layout (`icu_system/frontend/src/App.jsx`)
   - `Navbar`, `Sidebar`, and `Outlet` compose the main layout.

3. API client (`icu_system/frontend/src/shared/api.js`)
   - Axios instance `api` with base path `/api` and an interceptor to add bearer token.

4. Dashboard (`icu_system/frontend/src/pages/Dashboard.jsx`)
   - On mount fetches `/dashboard/` summary and `/alerts/` list, renders metric cards and an `AlertsPanel`.

5. Vitals charts (`icu_system/frontend/src/components/VitalsChart.jsx`)
   - Uses `recharts` `LineChart` to plot vitals over time. `formatData()` converts timestamps for axis labels.

6. Realtime updates
   - WebSocket route on backend pushes alerts; frontend listens and updates the `alerts` state.

7. Demo UX flow
   - Login → Dashboard (summary & alerts) → Click patient → View vitals trend + prediction → Trigger `POST /predict/{id}` to compute/persist prediction and surface an alert.

---

**Text data-flow (simple diagram)**

Devices / EMR -> Backend API -> Database (`Vitals`, `Notes`) -> Scheduler / Manual trigger -> `predict_patient()` -> `predictions` table -> Alerts & WebSocket -> Frontend UI

---

**Commands to run locally (PowerShell)**

From project root run backend and frontend in development:

```powershell
cd "c:\Users\ASUS\Desktop\Projects\FDS\Multimodality-Based ICU Patient Condition Monitoring System\icu_system"
# Start backend (ensure Python deps from backend/requirements.txt are installed)
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

Frontend (separate terminal):

```powershell
cd "c:\Users\ASUS\Desktop\Projects\FDS\Multimodality-Based ICU Patient Condition Monitoring System\icu_system\frontend"
npm install
npm run dev
```

Docker Compose (single-command dev/demo):

```powershell
cd "c:\Users\ASUS\Desktop\Projects\FDS\Multimodality-Based ICU Patient Condition Monitoring System\icu_system"
docker-compose up --build
```

**Quick curl examples**
- Fetch dashboard summary (GET):

```powershell
curl http://localhost:8000/api/dashboard/
```

- Trigger a prediction for patient `1` (POST):

```powershell
curl -X POST http://localhost:8000/api/predict/1
```

(If authentication enabled, include `-H "Authorization: Bearer <token>"`.)

---

**Demo script (90–120s)**
1. Open the Dashboard and explain what each card means (patient count, high risk, average risk). Mention these numbers are returned by `/dashboard/`.
2. Show the Alerts panel with active alerts (fetched from `/alerts/`).
3. Click a patient to open `PatientDetail` and show the `VitalsChart` with recent vitals timeline.
4. Press the Predict button (or call `POST /predict/{id}`) to run `predict_patient()`; explain the backend writes a `Prediction` row and alerts if threshold exceeded.
5. Explain the heuristic fallback vs. ML model path and where the model checkpoint resides (`backend/ml/checkpoints/model.pt`).

---

**Interview talking points & suggested wording**
- Problem statement: "A system to detect and alert on ICU patient deterioration by combining vitals and clinical notes."
- Design choices: "FastAPI for simple async HTTP + WebSocket support, React/Vite for fast frontend iteration, PyTorch for flexible modeling, SQLAlchemy ORM for DB-working productivity." 
- Resilience & performance: "Heuristic fallback ensures responsiveness; heavy ML inference can be moved to a GPU-backed microservice to keep the API layer lightweight." 
- Safety & next steps: "Add RBAC, encryption, audit logs, model explainability, and clinician-labeled outcomes for real-world retraining."

---

**Common interviewer questions and concise answers**
- Q: How do you integrate ML with the API?
  - A: `POST /predict/{patient_id}` calls `predict_patient()` which uses either a heuristic or (when loaded) a PyTorch model to compute and persist `Prediction` rows.
- Q: How would you scale inference?
  - A: Decouple inference into a dedicated inference microservice (TorchServe or FastAPI + GPU container), use a queue for requests (RabbitMQ/Kafka), and autoscale replicas.
- Q: How is the model version managed?
  - A: Checkpoints are saved under `backend/ml/checkpoints/` and predictions record `model_version`. For production, integrate a model registry and registry-backed rollout.

---

**Limitations & planned improvements**
- Current training labels are heuristic; acquire clinician-labeled outcomes for supervised learning.
- Move ML inference to a separate scalable service; add async loading and caching to reduce latency.
- Add unit and integration tests for endpoints and model components, monitoring, and CI/CD.
- Harden security: RBAC, audit logs, and data encryption.

---

**Next steps I can do for you**
- Produce a one-page slide deck (text bullets) from this file.
- Create speaker notes with 30–60s talking points per slide.
- Provide curl commands and a short script to demo the system live (including steps to seed DB and create a test patient).

---

If you'd like slides or speaker notes now, tell me which format (`slides` text, `speaker-notes`, or `curl-demo`) and I'll generate them and add to the repo as files.
