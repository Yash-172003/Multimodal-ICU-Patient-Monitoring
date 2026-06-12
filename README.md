# Multimodal-ICU-Patient-Monitoring

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-00a393.svg)](https://fastapi.tiangolo.com/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ed.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI-powered multimodal ICU patient monitoring system** with real-time vitals tracking, deep learning risk prediction, and an interactive clinical dashboard.

## 🎯 Overview

A full-stack system that combines **temporal vital sign analysis** (LSTM) with **clinical text understanding** (ClinicalBERT) to predict patient deterioration 24-36 hours in advance. Real-time WebSocket streaming keeps clinicians updated on critical patients.

**Built for**: Healthcare providers, clinical researchers, ICU teams  
**Status**: Production-ready with Docker support for Railway, Render, AWS

---

## ✨ Key Features

- 🔴 **Real-time Monitoring** — Live vital signs streaming via WebSocket (HR, BP, SpO₂, RR, Temp)
- 🤖 **Multimodal AI** — LSTM (temporal patterns) + ClinicalBERT (clinical context) fusion network
- 📊 **Interactive Dashboard** — React + Tailwind with Recharts visualizations
- ⚠️ **Smart Alerts** — High-risk patient notifications with risk trajectory
- 🔍 **Retrospective Analysis** — Risk timeline, vital history, trend analysis
- 📱 **Responsive Design** — Works on desktop, tablet, mobile
- 🗄️ **Flexible Storage** — SQLite (dev) or PostgreSQL (production)
- 🐳 **Docker Ready** — Single `docker compose up` for local dev, cloud deployment

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (or Python 3.11+ & Node 18+)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring.git
cd Multimodal-ICU-Patient-Monitoring
```

### 2. Setup Environment
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Run Everything
```bash
docker compose up --build
```

**Done!** Open your browser:

| Service | URL |
|---------|-----|
| **Dashboard** | http://localhost:8080 |
| **Backend API** | http://localhost:8000 |
| **API Docs (Swagger)** | http://localhost:8000/docs |
| **API ReDoc** | http://localhost:8000/redoc |

---

## 📚 Documentation

| Document | Purpose | Link |
|----------|---------|------|
| **Project Structure** | Folder organization, file purposes, dev practices | [View](icu_system/docs/project_structure.md) |
| **API Reference** | Endpoint documentation, request/response examples | [View](icu_system/docs/api.md) |
| **Deployment** | Docker, Railway, Render, AWS setup | [View](icu_system/docs/deployment.md) |
| **Implementation Summary** | Project overview and implementation details | [View](icu_system/docs/implementation_summary.md) |
| **Interview Presentation** | Project presentation materials | [View](icu_system/docs/interview_presentation.md) |
| **Patient Profiles** | Sample patient data and use cases | [View](icu_system/docs/patient_profiles.md) |
| **User Guide** | How to use the system | [View](icu_system/docs/user_guide.md) |

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Axios |
| **Backend** | FastAPI, SQLAlchemy, Pydantic, APScheduler |
| **ML** | PyTorch, HuggingFace Transformers (ClinicalBERT), scikit-learn |
| **Real-time** | WebSocket, Socket.io |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Dashboard                          │
│  (Real-time vitals, risk scores, alerts, patient history)   │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP + WebSocket
┌────────────────▼────────────────────────────────────────────┐
│                  FastAPI Backend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  API Routes  │  │  WebSocket   │  │ Scheduler    │       │
│  │  (patients,  │  │  (live       │  │ (periodic    │       │
│  │   vitals,    │  │   vitals)    │  │  predict)    │       │
│  │   alerts)    │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│               ML Prediction Pipeline                         │
│  ┌──────────────┐        ┌──────────────┐                   │
│  │ LSTM         │  +     │ ClinicalBERT │  →  Risk Score    │
│  │ (vitals)     │        │ (notes)      │                   │
│  └──────────────┘        └──────────────┘                   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│           Database (SQLite / PostgreSQL)                     │
│  Patients │ Vitals │ Risk Predictions │ Clinical Notes       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Risk Scoring

The system predicts **24-36 hour patient deterioration risk**:

| Score | Category | Interpretation | Action |
|-------|----------|----------------|--------|
| **< 40%** | ✅ Low | Stable condition | Routine monitoring |
| **40-69%** | ⚠️ Medium | Elevated risk | Increased vigilance |
| **≥ 70%** | 🔴 High | Critical risk | Escalate care, immediate alerts |

**Key Factors Considered:**
- Vital sign trends (heart rate, blood pressure, oxygen saturation)
- Rate of change (acceleration/deceleration patterns)
- Clinical notes context (via ClinicalBERT semantic analysis)
- Patient history and comorbidities

---

## 📂 Project Structure

```
## Project Structure

Multimodal-ICU-Patient-Monitoring/
│
├── backend/
│   └── database/
│       └── icu_monitoring.db
│
├── icu_system/
│   │
│   ├── backend/
│   │   │
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   │   └── 001_init.sql
│   │   │   ├── __init__.py
│   │   │   ├── db.py
│   │   │   └── seed_data.py
│   │   │
│   │   ├── ml/
│   │   │   ├── checkpoints/
│   │   │   │   └── README.txt
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── predict.py
│   │   │   ├── preprocess.py
│   │   │   ├── retrain.py
│   │   │   └── train_model.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── diagnosis.py
│   │   │   ├── intervention.py
│   │   │   ├── labs.py
│   │   │   ├── medication.py
│   │   │   ├── notes.py
│   │   │   ├── nursing_assessment.py
│   │   │   ├── patient.py
│   │   │   ├── prediction.py
│   │   │   ├── procedure.py
│   │   │   ├── user.py
│   │   │   └── vitals.py
│   │   │
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── alerts.py
│   │   │   ├── analytics.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── patients.py
│   │   │   ├── predictions.py
│   │   │   └── ws.py
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── scheduler.py
│   │   │   ├── schemas.py
│   │   │   └── ws.py
│   │   │
│   │   ├── Dockerfile
│   │   ├── __init__.py
│   │   ├── app.py
│   │   ├── config.py
│   │   └── requirements.txt
│   │
│   ├── docs/
│   │   ├── api.md
│   │   ├── deployment.md
│   │   ├── implementation_summary.md
│   │   ├── interview_presentation.md
│   │   ├── patient_profiles.md
│   │   ├── project_structure.md
│   │   └── user_guide.md
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AlertsPanel.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── PatientCard.jsx
│   │   │   │   ├── PredictionBadge.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Timeline.jsx
│   │   │   │   └── VitalsChart.jsx
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── PatientDetail.jsx
│   │   │   │   ├── PatientList.jsx
│   │   │   │   ├── Protocols.jsx
│   │   │   │   └── QualityMetrics.jsx
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── README.txt
│   │   │   │   └── api.js
│   │   │   │
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   └── main.jsx
│   │   │
│   │   ├── Dockerfile
│   │   ├── index.html
│   │   ├── nginx.conf
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   │
│   └── docker-compose.yml
│
├── README.md            
├──.gitignore
└── package-lock.json

```

**[View detailed structure →](icu_system/docs/project_structure.md)**

---

## 🎮 Demo Walkthrough

### 1. Load Sample Data
```bash
# Inside backend container
python -m backend.database.seed_data
```
Creates 5 synthetic patients with realistic vitals.

### 2. Train ML Model
```bash
python -m backend.ml.train_model
```
Trains multimodal LSTM + ClinicalBERT fusion on synthetic data.

### 3. Generate Predictions
```bash
python -m backend.ml.predict predict_all
```
Computes risk scores for all patients.

### 4. View Dashboard
Navigate to **http://localhost:8080** and explore:
- Patient list with risk summary
- Real-time vital signs
- Risk trajectory
- Alert notifications

---

## 💻 Development

### Run Locally Without Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev                        # Runs on http://localhost:5173
```

### Run Tests
```bash
cd backend
pytest tests/

cd frontend
npm run test
```

### Database Migrations
```bash
# If using Alembic
alembic upgrade head
alembic revision --autogenerate -m "Your message"
```

See [deployment.md](icu_system/docs/deployment.md) for detailed setup.

---

## 🚢 Deployment

### Docker Compose (Local Development)
```bash
docker compose up --build
```

### Cloud Platforms

**Railway**
1. Connect your GitHub repo to Railway
2. Create backend service from `backend/Dockerfile`
3. Create frontend service from `frontend/Dockerfile`
4. Set environment variables (DATABASE_URL, CORS origins, etc.)

**Render**
- Backend: Create Web Service with `backend/Dockerfile`, expose port 8000
- Frontend: Create Static Site with `frontend/` or Docker Web Service with `frontend/Dockerfile`

**AWS/GCP/Azure**
See [deployment.md](icu_system/docs/deployment.md) for detailed cloud setup guides.

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- **Backend**: Follow PEP 8, write async functions, add docstrings
- **Frontend**: Use functional components with Hooks, follow ESLint rules
- **ML**: Log predictions, version checkpoints, test with synthetic data
- **Tests**: Write tests for new features, maintain >80% coverage
- **Docs**: Update relevant documentation when adding features

---

## 📊 Project Statistics

- **Backend**: Python, FastAPI, 45.3% of codebase
- **Frontend**: JavaScript/React, 52.9% of codebase
- **Styling**: CSS/Tailwind, 1.2% of codebase
- **Status**: Active development, 25+ commits
- **License**: MIT (Open source)

---

## ⚖️ Clinical Disclaimer

⚠️ **IMPORTANT**: This system is for **research and decision support only**. It is **NOT** a replacement for clinical judgment.

Always consult with qualified medical professionals before making patient care decisions. The risk scores represent statistical predictions and should be interpreted within clinical context.

This system has NOT been validated for production clinical use without proper regulatory approval and clinical validation.

---

## 👥 Author

**Yash** — Full-stack Developer & ML Engineer  
GitHub: [@Yash-172003](https://github.com/Yash-172003)

---

## 💬 Support & Questions

- 📖 **Read the Docs**: Check [docs/](icu_system/docs/) for comprehensive guides
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/issues)
- 📧 **Contact**: Open an issue or discussion for questions

---

## 🙏 Acknowledgments

- **ClinicalBERT** — HuggingFace Transformers for medical NLP
- **MIMIC-IV** — Critical care dataset that inspired this project
- **FastAPI** — Modern, fast Python web framework
- **React** — UI library for interactive dashboards
- **PyTorch** — Deep learning framework

---

## 📈 Roadmap

- [ ] Integrate with EHR systems (Epic, Cerner)
- [ ] Mobile app (React Native)
- [ ] Real-time alerts via SMS/push notifications
- [ ] Multi-hospital analytics dashboard
- [ ] HIPAA compliance certification
- [ ] FDA validation and approval
- [ ] Explainability features (LIME, SHAP)
- [ ] Additional risk predictions (infection, sepsis, etc.)

---

<div align="center">

**Made with ❤️ for ICU care and patient safety**

[⭐ Star us on GitHub!](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring)

*Last updated: June 2026*

</div>
