import React, { useState, useEffect } from 'react'
import { api } from '../shared/api'

export default function Protocols() {
  const [protocols, setProtocols] = useState([])
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null)

  useEffect(() => {
    loadProtocols()
  }, [])

  const loadProtocols = async () => {
    try {
      const response = await api.get('/analytics/diagnosis-correlation')
      const diagnosisData = response.data.slice(0, 15)
      
      // Create evidence-based protocols for each diagnosis
      const protocolData = diagnosisData.map(d => ({
        id: d.icd10_code,
        diagnosis: d.description,
        icd10: d.icd10_code,
        avgRisk: d.average_risk,
        patientCount: d.patient_count,
        protocols: getProtocolForDiagnosis(d.icd10_code, d.description)
      }))
      
      setProtocols(protocolData)
    } catch (err) {
      console.error('Error loading protocols:', err)
    }
  }

  const getProtocolForDiagnosis = (code, description) => {
    // Evidence-based treatment protocols
    const protocols = {
      'I21.9': {
        monitoring: ['Continuous ECG monitoring', 'Troponin q6h', 'Daily echocardiogram'],
        medications: ['Aspirin 325mg', 'Clopidogrel 75mg', 'Heparin infusion', 'Beta-blocker', 'Statin'],
        interventions: ['Early cardiac catheterization', 'Oxygen therapy if SpO2 < 90%'],
        goals: ['MAP > 65 mmHg', 'HR 60-100', 'SpO2 > 92%']
      },
      'J96.01': {
        monitoring: ['ABG q4h', 'Continuous pulse oximetry', 'Ventilator parameters'],
        medications: ['Bronchodilators', 'Steroids if indicated', 'Antibiotics if infection'],
        interventions: ['Mechanical ventilation', 'PEEP optimization', 'Prone positioning if ARDS'],
        goals: ['SpO2 > 88%', 'PaCO2 35-45', 'pH 7.35-7.45']
      },
      'I50.9': {
        monitoring: ['Daily weights', 'Strict I&O', 'BNP monitoring', 'Daily chest X-ray'],
        medications: ['Diuretics', 'ACE inhibitor/ARB', 'Beta-blocker', 'Aldosterone antagonist'],
        interventions: ['Fluid restriction', 'Sodium restriction', 'Ultrafiltration if refractory'],
        goals: ['Euvolemic state', 'HR < 80', 'MAP > 65']
      },
      'N17.9': {
        monitoring: ['Creatinine daily', 'Urine output hourly', 'Electrolytes q6h', 'Fluid balance'],
        medications: ['Stop nephrotoxins', 'Dose adjust medications', 'Diuretics prn'],
        interventions: ['Dialysis if indicated', 'Optimize hemodynamics', 'Treat underlying cause'],
        goals: ['UOP > 0.5 mL/kg/hr', 'K+ < 5.5', 'No fluid overload']
      },
      'G93.1': {
        monitoring: ['Neurological checks q1h', 'ICP monitoring if severe', 'CT head prn'],
        medications: ['Hypertonic saline or mannitol', 'Seizure prophylaxis', 'Sedation'],
        interventions: ['HOB 30 degrees', 'Avoid hyperthermia', 'Maintain normoglycemia'],
        goals: ['ICP < 20 mmHg', 'CPP > 60 mmHg', 'GCS improvement']
      }
    }

    return protocols[code] || {
      monitoring: ['Vital signs q4h', 'Condition-specific labs'],
      medications: ['Symptom management', 'Supportive care'],
      interventions: ['Standard ICU care', 'Specialist consultation'],
      goals: ['Hemodynamic stability', 'Prevent complications']
    }
  }

  const getRiskColor = (risk) => {
    if (risk >= 0.7) return 'text-red-600 bg-red-50'
    if (risk >= 0.4) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 text-white px-6 py-8 rounded-xl shadow-xl animate-slideInUp">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-3xl font-bold">Evidence-Based Treatment Protocols</h1>
        </div>
        <p className="text-cyan-100">Clinical guidelines and best practices for ICU conditions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Protocol List */}
        <div className="md:col-span-1 space-y-2 animate-slideInLeft" style={{animationDelay: '0.1s'}}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg">
            <h3 className="font-bold text-lg">Diagnoses</h3>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full font-bold text-sm">{protocols.length}</span>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {protocols.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => setSelectedDiagnosis(p)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-slideInUp ${
                  selectedDiagnosis?.id === p.id 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
                style={{animationDelay: `${0.05 * idx}s`}}
              >
                <div className="font-semibold text-sm text-gray-800">{p.diagnosis}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">{p.icd10}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-1 rounded-lg font-bold ${getRiskColor(p.avgRisk)}`}>
                    Risk: {(p.avgRisk * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-semibold">{p.patientCount} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Details */}
        <div className="md:col-span-2 animate-slideInRight" style={{animationDelay: '0.2s'}}>
          {selectedDiagnosis ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedDiagnosis.diagnosis}</h2>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ICD-10: {selectedDiagnosis.icd10}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Patients: {selectedDiagnosis.patientCount}
                  </span>
                  <span className={`inline-flex items-center gap-1 font-bold px-3 py-1 rounded-lg ${getRiskColor(selectedDiagnosis.avgRisk)}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Avg Risk: {(selectedDiagnosis.avgRisk * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Monitoring */}
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Monitoring Requirements
                </h3>
                <ul className="space-y-2">
                  {selectedDiagnosis.protocols.monitoring.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <span className="text-blue-600 mt-1 text-xl">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medications */}
              <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-700">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  Medication Protocols
                </h3>
                <ul className="space-y-2">
                  {selectedDiagnosis.protocols.medications.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors">
                      <span className="text-green-600 mt-1 text-xl">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interventions */}
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-700">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
                    </svg>
                  </div>
                  Clinical Interventions
                </h3>
                <ul className="space-y-2">
                  {selectedDiagnosis.protocols.interventions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                      <span className="text-purple-600 mt-1 text-xl">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Goals */}
              <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-orange-700">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  Clinical Goals
                </h3>
                <ul className="space-y-2">
                  {selectedDiagnosis.protocols.goals.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50 transition-colors">
                      <span className="text-orange-600 mt-1 text-xl">•</span>
                      <span className="font-semibold text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl font-semibold text-gray-600">Select a diagnosis to view treatment protocols</p>
              <p className="text-sm mt-2 text-gray-500">Evidence-based guidelines for ICU management</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
