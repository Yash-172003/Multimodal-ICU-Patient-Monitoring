# Project Structure & Organization Guide

## Overview

This document provides a comprehensive guide to the **Multimodal-ICU-Patient-Monitoring** project structure, file organization, and development practices.

**Repository**: [Yash-172003/Multimodal-ICU-Patient-Monitoring](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring)

---

## Root Directory

```
Multimodal-ICU-Patient-Monitoring/
├── backend/                        # FastAPI server, ML models, database
├── frontend/                       # React + Vite dashboard
├── docs/                           # Detailed documentation
├── docker-compose.yml              # Local development setup
├── .gitignore                      # Git ignore rules
├── README.md                       # Project overview
├── LICENSE                         # MIT License
├── IMPLEMENTATION_SUMMARY.md       # Implementation details
├── INTERVIEW_PRESENTATION.md       # Interview materials
├── PATIENT_PROFILES.md             # Sample patient data
├── USER_GUIDE.md                   # User documentation
└── package-lock.json               # Node dependencies lock
```

---

## Backend Structure

### Overview

The backend is organized for clean separation of concerns using FastAPI, SQLAlchemy, and PyTorch.

```
backend/
├── app.py                   # FastAPI app initialization, main routes
├── config.py                # Configuration, environment variables
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container image
├── .env.example            # Environment variables template
│
├── database/               # Database layer
│   ├── db.py              # SQLAlchemy engine, session management
│   ├── models.py          # ORM models (Patient, Vitals, Risk, Notes)
│   └── seed_data.py       # Test data generation
│
├── ml/                     # Machine learning pipeline
│   ├── preprocess.py      # Data normalization, padding, tokenization
│   ├── train_model.py     # Multimodal model training (LSTM + ClinicalBERT)
│   ├── predict.py         # Single/batch prediction functions
│   ├── retrain.py         # Periodic retraining logic
│   └── checkpoints/       # Saved model weights and tokenizers
│
├── api/                    # REST API endpoints
│   ├── patients.py        # GET/POST patients, search, filtering
│   ├── vitals.py          # Stream vitals, get history, latest readings
│   ├── predictions.py     # Risk predictions, on-demand predict
│   └── alerts.py          # Fetch alerts, mark as read
│
└── utils/                  # Utility functions
    ├── validators.py      # Input validation, vital range checks
    ├── helpers.py         # Common utility functions
    └── constants.py       # Risk thresholds, vital ranges, defaults
```

### Key Backend Files

| File | Purpose |
|------|---------|
| **[app.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/app.py)** | FastAPI application entry point, route registration, WebSocket setup, CORS configuration |
| **[config.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/config.py)** | Settings from environment variables, database URL, API configuration, logging |
| **[requirements.txt](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/requirements.txt)** | Python dependencies: fastapi, sqlalchemy, torch, transformers, asyncpg, apscheduler, etc. |
| **[database/db.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/database/db.py)** | SQLAlchemy engine, session factory, connection pooling, database initialization |
| **[database/models.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/database/models.py)** | ORM models: Patient, Vitals, RiskPrediction, ClinicalNotes tables and relationships |
| **[database/seed_data.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/database/seed_data.py)** | Generates synthetic test patients and vital sign data for development |
| **[ml/train_model.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/ml/train_model.py)** | Multimodal model training: LSTM (vitals) + ClinicalBERT (notes) fusion network |
| **[ml/predict.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/ml/predict.py)** | Real-time and batch prediction functions for risk score computation |
| **[api/patients.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/api/patients.py)** | CRUD operations for patients, search, filtering, pagination |
| **[api/vitals.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/api/vitals.py)** | WebSocket vitals streaming, historical data retrieval, latest readings |
| **[api/predictions.py](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/api/predictions.py)** | Risk score endpoint, on-demand predictions, prediction history |

---

## Frontend Structure

### Overview

React components organized by feature using Vite, Tailwind CSS, and Recharts for visualization.

```
frontend/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Dashboard.jsx   # Main dashboard view
│   │   ├── PatientsList.jsx
│   │   ├── PatientDetail.jsx
│   │   ├── VitalsChart.jsx
│   │   ├── RiskTimeline.jsx
│   │   └── AlertPanel.jsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useWebSocket.js
│   │   ├── useApi.js
│   │   └── useLocalStorage.js
│   │
│   ├── services/           # API and external service clients
│   │   ├── apiClient.js
│   │   ├── websocketService.js
│   │   └── authService.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── store/              # State management (Zustand/Redux)
│   │   ├── patientStore.js
│   │   ├── vitalsStore.js
│   │   └── uiStore.js
│   │
│   ├── styles/             # CSS files
│   │   ├── global.css
│   │   └── theme.js
│   │
│   ├── pages/              # Page-level components
│   │   ├── DashboardPage.jsx
│   │   └── LoginPage.jsx
│   │
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
│
├── public/                 # Static assets (images, icons)
├── package.json            # Dependencies, scripts
├── vite.config.js         # Vite bundler configuration
├── tailwind.config.js     # Tailwind CSS customization
├── postcss.config.js      # PostCSS setup for Tailwind
├── Dockerfile             # Container image (Node build + nginx)
├── nginx.conf            # Nginx configuration for production
└── .env.example          # Environment variables template
```

### Key Frontend Files

| File | Purpose |
|------|---------|
| **[src/components/Dashboard.jsx](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/components/Dashboard.jsx)** | Main dashboard with patient grid, summary cards, vital charts |
| **[src/components/PatientsList.jsx](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/components/PatientsList.jsx)** | Scrollable list of patients with latest vitals and risk scores |
| **[src/components/PatientDetail.jsx](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/components/PatientDetail.jsx)** | Individual patient detail page with full history |
| **[src/components/VitalsChart.jsx](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/components/VitalsChart.jsx)** | Real-time vital signs line charts (HR, BP, SpO₂, RR, Temp) |
| **[src/components/RiskTimeline.jsx](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/components/RiskTimeline.jsx)** | Area chart of risk score history over time |
| **[src/hooks/useWebSocket.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/hooks/useWebSocket.js)** | WebSocket connection management and reconnection logic |
| **[src/hooks/useApi.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/hooks/useApi.js)** | Wrapper around axios for REST API calls with error handling |
| **[src/services/apiClient.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/src/services/apiClient.js)** | Axios instance with base URL, interceptors, authentication headers |
| **[vite.config.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/vite.config.js)** | Vite configuration: API proxy, plugins, build optimization |
| **[tailwind.config.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/tailwind.config.js)** | Tailwind CSS customization: colors, spacing, breakpoints, plugins |

---

## Documentation (docs/)

Detailed guides and references for different aspects of the system.

```
docs/
├── PROJECT_STRUCTURE.md      # This file - detailed folder organization
├── API.md                    # REST API endpoint reference
├── ARCHITECTURE.md           # System design, data flow, ML pipeline
├── DEPLOYMENT.md             # Docker, Railway, Render, AWS setup
├── DEVELOPMENT.md            # Local development setup, testing
├── ML_MODEL.md               # Model architecture, training, evaluation
└── CLINICAL.md               # Risk thresholds, clinical interpretation
```

### Documentation Files

| Document | Purpose |
|----------|---------|
| **[docs/API.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docs/API.md)** | Complete REST API endpoint reference with request/response examples |
| **[docs/ARCHITECTURE.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docs/ARCHITECTURE.md)** | System design, data flow diagrams, ML pipeline details |
| **[docs/DEPLOYMENT.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docs/DEPLOYMENT.md)** | Step-by-step deployment guides for Docker, Railway, Render, AWS |
| **[docs/DEVELOPMENT.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docs/DEVELOPMENT.md)** | Environment setup, testing, debugging, development guidelines |
| **[docs/ML_MODEL.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docs/ML_MODEL.md)** | LSTM architecture, ClinicalBERT tokenization, training procedure, metrics |
| **[docs/CLINICAL.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docs/CLINICAL.md)** | Risk score interpretation, alert thresholds, clinical context |

---

## Root Level Configuration Files

| File | Purpose |
|------|---------|
| **[docker-compose.yml](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/docker-compose.yml)** | Docker Compose configuration for local development (backend, frontend, database) |
| **[.gitignore](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/.gitignore)** | Git ignore patterns (node_modules, __pycache__, .env, venv, etc.) |
| **[README.md](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/README.md)** | Project overview, quick start, features, deployment |
| **[LICENSE](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/LICENSE)** | MIT License |

---

## Repository Root Documentation Files

### Educational & Reference Materials

| File | Purpose | Link |
|------|---------|------|
| **IMPLEMENTATION_SUMMARY.md** | Technical implementation details and project overview | [View](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/IMPLEMENTATION_SUMMARY.md) |
| **INTERVIEW_PRESENTATION.md** | Presentation materials for technical interviews | [View](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/INTERVIEW_PRESENTATION.md) |
| **PATIENT_PROFILES.md** | Sample patient data, use cases, and clinical scenarios | [View](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/PATIENT_PROFILES.md) |
| **USER_GUIDE.md** | End-user guide and system tutorials | [View](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/USER_GUIDE.md) |

---

## Backend Configuration Files

| File | Purpose |
|------|---------|
| **[backend/requirements.txt](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/requirements.txt)** | Python dependencies specification |
| **[backend/Dockerfile](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/Dockerfile)** | Docker image definition for backend container |
| **[backend/.env.example](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/backend/.env.example)** | Template for environment variables |

---

## Frontend Configuration Files

| File | Purpose |
|------|---------|
| **[frontend/package.json](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/package.json)** | Node.js dependencies and scripts |
| **[frontend/vite.config.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/vite.config.js)** | Vite bundler configuration and optimization |
| **[frontend/tailwind.config.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/tailwind.config.js)** | Tailwind CSS configuration and theming |
| **[frontend/postcss.config.js](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/postcss.config.js)** | PostCSS configuration for Tailwind |
| **[frontend/Dockerfile](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/Dockerfile)** | Docker image definition (Node build + Nginx) |
| **[frontend/nginx.conf](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/nginx.conf)** | Nginx configuration for production serving |
| **[frontend/.env.example](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/blob/main/frontend/.env.example)** | Template for frontend environment variables |

---

## Development Best Practices

### Backend Development

✅ **Use async/await** for all database and API operations  
✅ **Leverage APScheduler** for periodic predictions and background tasks  
✅ **Implement CORS** with specific allowed origins  
✅ **Use Pydantic models** for request/response validation  
✅ **Stream WebSocket messages** with proper context managers  
✅ **Log all predictions** for reproducibility and debugging  
✅ **Validate vital ranges** before database insertion  
✅ **Add docstrings** to all functions and classes  
✅ **Write type hints** for better IDE support  
✅ **Use environment variables** for configuration (never hardcode secrets)

### Frontend Development

✅ **Use functional components** with React Hooks (no class components)  
✅ **Keep components focused** and reusable (single responsibility)  
✅ **Use Tailwind CSS** for consistent styling across the app  
✅ **Implement WebSocket** for real-time updates with graceful degradation  
✅ **Use Error Boundaries** for error handling and resilience  
✅ **Memoize expensive computations** with `useMemo` and `useCallback`  
✅ **Lazy load heavy charts** with React Suspense  
✅ **Write meaningful prop documentation** and JSDoc comments  
✅ **Test components** with Jest and React Testing Library  
✅ **Follow ESLint** and Prettier configurations  

### ML/Data Pipeline

✅ **Normalize vital signs** (z-score or min-max) before model input  
✅ **Use sliding windows** for temporal feature extraction  
✅ **Tokenize clinical notes** with ClinicalBERT tokenizer  
✅ **Log model inputs, outputs**, and predictions for traceability  
✅ **Version model checkpoints** with timestamp and metrics  
✅ **Test predictions** with synthetic data before production deployment  
✅ **Monitor model drift** and retrain periodically  
✅ **Document preprocessing steps** for reproducibility  
✅ **Store training hyperparameters** and metrics  
✅ **Handle missing data** appropriately during preprocessing  

---

## File Naming Conventions

### Backend
- **Python files**: `snake_case.py`
- **Classes**: `PascalCase`
- **Functions/variables**: `snake_case`
- **Constants**: `UPPER_SNAKE_CASE`

### Frontend
- **React components**: `PascalCase.jsx`
- **Utilities/hooks**: `camelCase.js`
- **CSS files**: `kebab-case.css`
- **Variables/functions**: `camelCase`

### Documentation
- **Markdown files**: `UPPER_SNAKE_CASE.md` or `PascalCase.md`
- **Internal links**: Use relative paths with `[text](path/to/file.md)`

---

## Git Workflow

### Branch Naming
```
feature/feature-name          # New features
bugfix/bug-name              # Bug fixes
docs/documentation-name      # Documentation updates
refactor/refactor-name       # Code refactoring
```

### Commit Message Format
```
<type>: <subject>

<body>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Example**:
```
feat: Add WebSocket real-time vital streaming

- Implement WebSocket endpoint for live vitals
- Add client-side connection management
- Update API documentation
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./icu.db
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
API_KEY=your_api_key_here
MODEL_PATH=./checkpoints/model.pt
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## Testing Strategy

### Backend Tests
- **Unit tests**: Individual function behavior
- **Integration tests**: Database operations, API endpoints
- **ML tests**: Model inference, prediction correctness

```bash
pytest tests/ -v --cov=backend
```

### Frontend Tests
- **Component tests**: Component rendering and interactions
- **Hook tests**: Custom hook behavior
- **Integration tests**: Multi-component workflows

```bash
npm run test -- --coverage
```

---

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Model checkpoints included
- [ ] Documentation updated
- [ ] Security review completed
- [ ] Performance benchmarks acceptable
- [ ] Error logging configured
- [ ] Monitoring setup complete
- [ ] Backup strategy in place

---

## Quick Reference Links

| Resource | URL |
|----------|-----|
| **Repository** | [github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring) |
| **Issues** | [github.com/.../issues](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/issues) |
| **Discussions** | [github.com/.../discussions](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/discussions) |
| **Commits** | [github.com/.../commits](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/commits) |
| **Branches** | [github.com/.../branches](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring/branches) |

---

## Common Tasks

### Add a New Backend Endpoint
1. Create route handler in `backend/api/`
2. Add Pydantic model for request/response
3. Update `backend/app.py` to include new router
4. Document in `docs/API.md`

### Add a New Frontend Component
1. Create component in `backend/src/components/`
2. Add props interface and documentation
3. Import and use in parent component
4. Test with sample data
5. Style with Tailwind CSS

### Train a New Model
1. Update training data in `backend/database/seed_data.py`
2. Modify hyperparameters in `backend/ml/train_model.py`
3. Run training: `python -m backend.ml.train_model`
4. Evaluate metrics and save checkpoint
5. Update model path in `.env`

---

## Performance Optimization

### Backend
- Use database indexing for frequently queried columns
- Implement query pagination for large datasets
- Cache prediction results with Redis
- Use connection pooling for database

### Frontend
- Code splitting for large bundles
- Lazy loading for route components
- Memoization for expensive computations
- Image optimization and compression

---

## Security Considerations

- ✅ Never commit `.env` files or secrets
- ✅ Validate all user inputs server-side
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on API
- ✅ Sanitize database queries (SQLAlchemy ORM handles this)
- ✅ Use secure session tokens
- ✅ Implement CORS properly
- ✅ Regular security audits

---

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process on port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

**Database connection error**
- Check DATABASE_URL in `.env`
- Ensure database file exists or PostgreSQL is running

**WebSocket connection fails**
- Check CORS configuration
- Verify WebSocket endpoint is accessible
- Check browser console for detailed errors

---

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [SQLAlchemy ORM Tutorial](https://docs.sqlalchemy.org/)
- [PyTorch Documentation](https://pytorch.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

*Last updated: June 2026*

**Created by**: Yash — [GitHub Profile](https://github.com/Yash-172003)

**Repository**: [Multimodal-ICU-Patient-Monitoring](https://github.com/Yash-172003/Multimodal-ICU-Patient-Monitoring)
