# Deployment

## Local (Developer)
- Backend:
  - `pip install -r backend/requirements.txt`
  - `uvicorn backend.app:app --reload --port 8000`
- Frontend:
  - `cd frontend && npm install`
  - `npm run dev`

## Docker Compose
- Build and run:
  ```bash
  docker compose up --build
  ```
- Frontend at http://localhost:8080, Backend at http://localhost:8000

## Railway
- Create a new project
- Add service "backend" from Dockerfile `backend/Dockerfile`
  - Expose port 8000
  - Env: `DATABASE_URL=sqlite:///./icu.db`, `BACKEND_CORS_ORIGINS=["*"]`
- Add service "frontend" from Dockerfile `frontend/Dockerfile`
  - Expose port 80
- Connect custom domains if needed

## Render
- Backend: create Web Service from repo with Dockerfile `backend/Dockerfile`, port 8000
- Frontend: create Web Service with Dockerfile `frontend/Dockerfile`, port 80 (or Static Site using Vite build)
- Set environment variables for backend accordingly

## PostgreSQL (Optional)
- Set `DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/db` in backend env
- Ensure network access and credentials are configured

## Notes
- First run will download HuggingFace models; cache persists in container layer or volume.
- Adjust scheduler intervals via `PREDICTION_INTERVAL_MINUTES` and `DAILY_BATCH_TIME` envs.
