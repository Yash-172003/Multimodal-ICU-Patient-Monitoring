# API Documentation

Base URL: http://localhost:8000

## Auth
- POST `/auth/login`
  - body: `{ "username": "admin", "password": "admin" }`
  - resp: `{ "access_token": "...", "token_type": "bearer" }`

## Patients
- GET `/patients/`
  - resp: `PatientDetail[]`
- GET `/patients/{id}`
  - resp: `PatientDetail`
- GET `/patients/{id}/vitals?hours=24`
  - resp: `Vitals[]` ascending by time
- GET `/patients/{id}/predictions?limit=100`
  - resp: `Prediction[]` ascending by time

## Predictions
- POST `/predict/{id}`
  - resp: `Prediction`

## Dashboard
- GET `/dashboard/`
  - resp: `{ patient_count, high_risk_count, average_risk }`

## Alerts
- GET `/alerts/`
  - resp: `AlertItem[]` high-risk only

## WebSocket
- WS `/ws/vitals/{id}`
  - server sends JSON samples: vitals object for the given patient every ~5s

