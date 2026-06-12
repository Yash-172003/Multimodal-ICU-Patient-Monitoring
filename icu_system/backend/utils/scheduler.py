from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import time
from ..config import settings
from ..ml.predict import predict_all_patients

scheduler = AsyncIOScheduler()

async def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        scheduler.add_job(predict_all_patients, IntervalTrigger(minutes=settings.PREDICTION_INTERVAL_MINUTES))
        h, m = settings.DAILY_BATCH_TIME.split(":")
        scheduler.add_job(predict_all_patients, CronTrigger(hour=int(h), minute=int(m)))
