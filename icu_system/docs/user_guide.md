# User Guide - ICU Monitoring System

## 🚀 Quick Start

```bash
cd /Users/umarkhan/Desktop/FDS_KUCH/icu_system
docker compose up -d
```

Open: **http://localhost:8080**  
Login: `admin` / `admin`

---

## 📱 Feature Overview

### ✅ What's Working Now

1. **Dashboard** - Overview of 15 patients across 5 ICU units
2. **Patient Details** - Comprehensive profiles with vitals charts
3. **Risk Prediction** - Instant heuristic scoring (0-100%)
4. **Population Analytics** ⭐ - Retrospective analysis with interactive charts
5. **Treatment Protocols** ⭐ - Evidence-based clinical guidelines
6. **Quality Metrics** ⭐ - Performance tracking and improvement recommendations

---

## 🎯 How to Use Each Feature

### 1. Dashboard
**What you'll see:**
- 15 patient cards with demographics
- ICU unit assignments (MICU, SICU, CCU, ICU-1, ICU-2)
- Current vital signs
- Risk scores (after prediction)

**What to do:**
- Click any patient card to view details
- Filter by risk level or unit
- Monitor overall ICU status

---

### 2. Patient Detail
**What you'll see:**
- Patient demographics and admission info
- Latest vital signs with interactive charts
- "Run Prediction" button
- Clinical timeline
- Laboratory results

**What to do:**
1. Click "Run Prediction" for instant risk score
2. Watch circular progress fill to exact percentage
3. Review vitals trends on interactive chart
4. Check clinical timeline for recent events

**Pro Tip:** Prediction updates instantly without page refresh!

---

### 3. Population Analytics ⭐ NEW

**What you'll see:**
- **Top Stats**: Total patients, avg age, high-risk count
- **Gender Distribution**: Pie chart
- **Unit Distribution**: Bar chart
- **Risk Trends**: 7-day line graph
- **Diagnosis Correlation**: Top 10 diagnoses by risk
- **Treatment Efficacy**: Medication effectiveness table
- **Temporal Patterns**: 24-hour vital sign trends

**What to do:**
1. Navigate to "Population Analytics" in sidebar
2. Review population statistics at top
3. Scroll through interactive charts
4. Hover over charts for detailed tooltips
5. Identify high-risk diagnoses and patterns

**Use Cases:**
- Quality improvement analysis
- Resource allocation planning
- Trend identification
- Treatment optimization

---

### 4. Treatment Protocols ⭐ NEW

**What you'll see:**
- **Left Panel**: List of 15+ diagnoses with ICD-10 codes
- **Right Panel**: Detailed protocol for selected diagnosis

**Each Protocol Contains:**
- 📊 Monitoring requirements (what to track, how often)
- 💊 Medication protocols (evidence-based regimens)
- ⚕️ Clinical interventions (key procedures)
- 🎯 Clinical goals (target values)

**What to do:**
1. Select a diagnosis from left panel
2. Review monitoring requirements
3. Check medication protocols
4. Note clinical goals and targets
5. Compare protocols across different conditions

**Available Protocols:**
- Acute Myocardial Infarction (I21.9)
- Acute Respiratory Failure (J96.01)
- Congestive Heart Failure (I50.9)
- Acute Kidney Injury (N17.9)
- Sepsis and Septic Shock
- ARDS, Stroke, Trauma, and more

---

### 5. Quality Metrics ⭐ NEW

**What you'll see:**

**Executive Summary (30 days):**
- Total patients assessed
- High-risk percentage
- Average risk reduction
- Active diagnoses

**Key Performance Indicators:**
- Treatment engagement rate
- Procedure completion rate
- Intervention response time

**Treatment Efficacy Benchmarks:**
- Medications graded A-F
- Pre/post-treatment risk scores
- Improvement percentages
- Patient counts

**What to do:**
1. Review 30-day executive summary
2. Check KPI progress bars
3. Analyze treatment efficacy grades
4. Identify Grade A treatments (>15% improvement)
5. Read quality improvement recommendations

**Grading Scale:**
- A: >15% improvement
- B: 10-15% improvement
- C: 5-10% improvement
- D: 0-5% improvement
- F: Negative improvement

---

## 🔄 Complete Workflow Example

### Scenario: New Patient Deteriorating

1. **Dashboard** → Notice patient with abnormal vitals
2. **Patient Detail** → Click patient, review vitals chart
3. **Run Prediction** → Get instant risk score (e.g., 68% high risk)
4. **Treatment Protocols** → Navigate to protocols page
5. **Select Diagnosis** → Choose patient's primary diagnosis
6. **Review Protocol** → Check evidence-based recommendations
7. **Quality Metrics** → Verify treatment efficacy for recommended medications
8. **Analytics** → Compare patient to population trends

---

## 📊 Understanding the Data

### Risk Scores
- **0-30%**: Low risk (green)
- **31-60%**: Medium risk (yellow)
- **61-100%**: High risk (red)

### Vital Sign Ranges (Normal)
- Heart Rate: 60-100 bpm
- Systolic BP: 90-140 mmHg
- Diastolic BP: 60-90 mmHg
- SpO2: >95%
- Respiratory Rate: 12-20 breaths/min
- Temperature: 36.5-37.5°C
- GCS: 15 (fully alert)

### ICD-10 Codes
- **I-codes**: Circulatory system (I21.9 = STEMI)
- **J-codes**: Respiratory system (J96.01 = Resp failure)
- **N-codes**: Genitourinary system (N17.9 = AKI)
- **A-codes**: Infectious diseases (A41.9 = Sepsis)
- **G-codes**: Nervous system (G93.1 = Brain injury)

---

## 💡 Pro Tips

### Maximize System Value
1. **Run predictions regularly** to build trend data
2. **Review analytics weekly** for quality improvement
3. **Use protocols as decision support** not replacement
4. **Monitor temporal patterns** to optimize staffing
5. **Track treatment efficacy** to refine care protocols

### Chart Interactions
- **Hover** over data points for exact values
- **Click legends** to toggle data series
- **Scroll** within charts for more details

### Navigation Shortcuts
- **Click logo** to return to dashboard
- **Use sidebar** for quick feature access
- **Back button** works throughout app

---

## 🔧 Troubleshooting

### System Issues
| Problem | Solution |
|---------|----------|
| Can't access http://localhost:8080 | Check Docker: `docker ps` |
| Login fails | Use lowercase: `admin` / `admin` |
| Prediction doesn't update | Refresh page once, then retry |
| Charts not loading | Wait 2-3 seconds for data fetch |
| Analytics empty | Run predictions on patients first |

### Common Questions

**Q: Why are risk scores 0%?**  
A: Run prediction on patients first. Click "Run Prediction" on patient detail page.

**Q: Why is treatment efficacy empty?**  
A: Requires before/after predictions. Run predictions, modify patient data, run again.

**Q: Can I add more patients?**  
A: Yes! Use backend API: POST `/api/patients` with patient data.

**Q: How do I reset the system?**  
A: `docker compose down`, delete database, `docker compose up -d`

**Q: Where is the data stored?**  
A: SQLite database at `backend/database/icu_monitoring.db`

---

## 📈 Data Summary

### Current Database
- **15 Patients** with realistic clinical profiles
- **60+ Diagnoses** (ICD-10 coded)
- **45+ Procedures** (CPT coded)
- **100+ Medications** with full dosing info
- **75+ Interventions** tracked and documented
- **75+ Nursing Assessments** with 18 fields each

### Conditions Represented
- Cardiac (STEMI, CHF, unstable angina)
- Respiratory (ARDS, pneumonia, failure)
- Trauma (polytrauma, flail chest)
- Sepsis (severe sepsis with shock)
- Neurological (stroke, anoxic brain injury)
- Renal (acute kidney injury)
- Metabolic (DKA)

---

## 🎓 Learning Resources

### Understand the System
1. **API Documentation**: http://localhost:8000/docs
2. **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
3. **Database Schema**: See `backend/database/migrations/001_init.sql`

### Clinical Context
- ICD-10 codes: https://www.icd10data.com
- CPT codes: https://www.aapc.com/codes/cpt-codes/
- Evidence-based medicine: https://www.uptodate.com

---

## 🚀 Advanced Usage

### For Developers

**Add New Patient:**
```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test Patient", "age": 45, ...}'
```

**View Raw Data:**
```bash
docker exec -it icu_system-backend-1 sqlite3 /app/backend/database/icu_monitoring.db
```

**Check Logs:**
```bash
docker logs icu_system-backend-1 --tail 100
```

### For Researchers

**Export Data:**
```bash
docker exec icu_system-backend-1 sqlite3 /app/backend/database/icu_monitoring.db .dump > export.sql
```

**Access API Programmatically:**
```python
import requests
response = requests.get('http://localhost:8080/api/analytics/population-stats')
data = response.json()
```

---

## 📞 Support

### Getting Help
1. Check this user guide
2. Review API docs: http://localhost:8000/docs
3. Check system logs: `docker logs icu_system-backend-1`
4. Review implementation summary: `IMPLEMENTATION_SUMMARY.md`

### System Information
- **Version**: 2.0
- **Last Updated**: November 13, 2024
- **Status**: Production Ready ✅

---

**Ready to start? Open:** http://localhost:8080

Login with: `admin` / `admin`

Enjoy your comprehensive ICU monitoring system! 🏥📊
