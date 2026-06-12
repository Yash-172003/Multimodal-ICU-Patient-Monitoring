# Multimodal-ICU-Patient-Monitoring

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-00a393.svg)](https://fastapi.tiangolo.com/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ed.svg)](https://www.docker.com/)

**AI-powered ICU patient monitoring system** with real-time vitals tracking, multimodal risk prediction, and an interactive clinical dashboard.

## 🎯 Overview

A full-stack system that combines **temporal vital sign analysis** (LSTM) with **clinical text understanding** (ClinicalBERT) to predict patient deterioration 24-36 hours in advance. Real-time WebSocket streaming keeps clinicians updated on critical patients.

**Built for**: Healthcare providers, clinical researchers, ICU teams  
**Status**: Production-ready with Docker support for Railway, Render, AWS

---

## ✨ Features

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

Done! Open your browser:

| Service | URL |
|---------|-----|
| **Dashboard** | http://localhost:8080 |
| **API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |

---

## 💻 Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts |
| **Backend** | FastAPI, SQLAlchemy, Pydantic |
| **ML** | PyTorch, HuggingFace Transformers (ClinicalBERT), scikit-learn |
| **Real-time** | WebSocket, APScheduler |
| **Database** | SQLite / PostgreSQL |
| **DevOps** | Docker, Nginx, Docker Compose |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[Project Structure](docs/PROJECT_STRUCTURE.md)** | Folder organization, file purposes, dev practices |
| **[API Reference](docs/API.md)** | Endpoint documentation, request/response examples |
| **[Architecture](docs/ARCHITECTURE.md)** | System design, data flow, ML pipeline |
| **[Deployment](docs/DEPLOYMENT.md)** | Docker, Railway, Render, AWS setup |
| **[Development](docs/DEVELOPMENT.md)** | Local setup, testing, debugging |
| **[ML Model](docs/ML_MODEL.md)** | Model architecture, training, evaluation |
| **[Clinical Guide](docs/CLINICAL.md)** | Risk interpretation, thresholds, clinical context |

---

## 🎮 Demo Walkthrough

### 1. Load Sample Data
```bash
# Inside backend container or venv
python -m backend.database.seed_data
```
Creates 5 synthetic patients with realistic vitals.

### 2. Train Model
```bash
python -m backend.ml.train_model
```
Trains multimodal LSTM + ClinicalBERT on synthetic data (~2-5 min).

### 3. Generate Predictions
```bash
python -m backend.ml.predict predict_all
```
Computes risk scores for all patients.

### 4. View Dashboard
- Navigate to **http://localhost:8080**
- Select a patient to see live vitals and risk trajectory
- Check alerts for high-risk cases

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

| Score | Category | Action |
|-------|----------|--------|
| **< 40%** | ✅ Low | Routine monitoring |
| **40-69%** | ⚠️ Medium | Increased vigilance |
| **≥ 70%** | 🔴 High | Escalate care, alerts |

**Factors Considered:**
- Vital sign trends (heart rate, BP, O₂ sat)
- Rate of change (acceleration/deceleration)
- Clinical notes context (via ClinicalBERT)
- Patient history and comorbidities

---

## 🛠️ Development

### Run Locally (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Run Tests
```bash
pytest backend/tests/
npm run test  # frontend
```

### Database Migrations
```bash
# If using Alembic
alembic upgrade head
alembic revision --autogenerate -m "Add new column"
```

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup.

---

## 🚢 Deployment

### Docker Compose (Local)
```bash
docker compose up --build
```

### Railway
1. Create new project from this repo
2. Add backend service (expose port 8000)
3. Add frontend service (expose port 80)
4. Set environment variables

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for Railway, Render, AWS guides.

---

## 📊 Project Structure

```
Multimodal-ICU-Patient-Monitoring/
├── backend/              # FastAPI, ML, database
├── frontend/             # React dashboard
├── docs/                 # Documentation
├── docker-compose.yml    # Local orchestration
└── README.md            # This file
```

**[View full structure →](docs/PROJECT_STRUCTURE.md)**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Guidelines:**
- Follow PEP 8 (Python) and ESLint (JavaScript)
- Add tests for new features
- Update documentation if needed
- Keep commits focused and well-described

---

## 📖 Clinical Disclaimer

⚠️ **This system is for research and decision support only.** It should not replace clinical judgment. Always consult with medical professionals for patient care decisions.

The risk scores represent statistical predictions based on the training data and should be interpreted in clinical context.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Yash** — [GitHub](https://github.com/Yash-172003)

---

## 💬 Questions & Support

- 📖 [Read the docs](docs/)
- 🐛 [Report an issue](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/issues)
- 💡 [Suggest a feature](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/discussions)

---

## 🙏 Acknowledgments

- **ClinicalBERT** — Medical text understanding from HuggingFace
- **MIMIC-IV** — Critical care data research inspiration
- **FastAPI** — Modern Python web framework
- **React** — UI library

---

**Made with ❤️ for ICU care**

*Last updated: June 2026*
