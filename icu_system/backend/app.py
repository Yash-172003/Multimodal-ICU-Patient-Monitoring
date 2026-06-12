from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database.db import Base, engine, SessionLocal
from .database.seed_data import seed
from .utils.scheduler import start_scheduler
from .utils.auth import router as auth_router
from .routes.patients import router as patients_router
from .routes.predictions import router as predictions_router
from .routes.dashboard import router as dashboard_router
from .routes.alerts import router as alerts_router
from .routes.ws import router as ws_router
from .routes.analytics import router as analytics_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(predictions_router)
app.include_router(dashboard_router)
app.include_router(alerts_router)
app.include_router(ws_router)
app.include_router(analytics_router)

@app.on_event("startup")
async def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
    await start_scheduler()

@app.get("/")
def root():
    return {"status": "ok", "app": settings.APP_NAME}
