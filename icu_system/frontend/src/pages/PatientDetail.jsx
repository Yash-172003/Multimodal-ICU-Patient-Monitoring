import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../shared/api'
import VitalsChart from '../components/VitalsChart'
import PredictionBadge from '../components/PredictionBadge'
import Timeline from '../components/Timeline'

function useWebSocketVitals(patientId) {
  const [last, setLast] = useState(null)
  useEffect(() => {
    if (!patientId) return
    const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/vitals/${patientId}`)
    ws.onmessage = (evt) => {
      try { setLast(JSON.parse(evt.data)) } catch {}
    }
    return () => ws.close()
  }, [patientId])
  return last
}

export default function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [vitals, setVitals] = useState([])
  const [preds, setPreds] = useState([])
  const lastWS = useWebSocketVitals(id)

  const load = async () => {
    const p = await api.get(`/patients/${id}`)
    setPatient(p.data)
    const v = await api.get(`/patients/${id}/vitals?hours=24`)
    setVitals(v.data)
    const pr = await api.get(`/patients/${id}/predictions?limit=200`)
    setPreds(pr.data)
  }

  useEffect(() => { load() }, [id])

  useEffect(() => {
    if (lastWS) setVitals(prev => [...prev.slice(-95), lastWS])
  }, [lastWS])

  const onPredict = async () => {
    const predResult = await api.post(`/predict/${id}`)
    const newPred = predResult.data
    
    // Update patient with new latest_prediction
    setPatient(prev => ({
      ...prev,
      latest_prediction: newPred
    }))
    
    // Update predictions list
    const pr = await api.get(`/patients/${id}/predictions?limit=200`)
    setPreds(pr.data)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {patient && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6 shadow-lg animate-slideInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md font-medium">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    MRN {patient.mrn}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md font-medium">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {patient.gender}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md font-medium">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {patient.age}y
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md font-medium">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {patient.unit}/{patient.bed_id}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PredictionBadge score={patient.latest_prediction?.risk_score ?? 0} level={patient.latest_prediction?.risk_level ?? 'low'} />
              <button 
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                onClick={onPredict}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Run Prediction
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="animate-slideInLeft" style={{animationDelay: '0.1s'}}>
        <VitalsChart vitals={vitals} />
      </div>
      
      <div className="animate-slideInRight" style={{animationDelay: '0.2s'}}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex items-center gap-3 shadow-lg">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xl font-bold">Risk Trajectory</span>
        </div>
        <div className="bg-white rounded-b-xl shadow-lg">
          <Timeline predictions={preds} />
        </div>
      </div>
    </div>
  )
}
