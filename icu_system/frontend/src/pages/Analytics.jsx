import React, { useEffect, useState } from 'react'
import { api } from '../shared/api'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const [popStats, setPopStats] = useState(null)
  const [riskTrends, setRiskTrends] = useState([])
  const [diagnosisCorr, setDiagnosisCorr] = useState([])
  const [treatmentEff, setTreatmentEff] = useState([])
  const [temporalPatterns, setTemporalPatterns] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [pop, trends, diag, treatment, temporal] = await Promise.all([
        api.get('/analytics/population-stats'),
        api.get('/analytics/risk-trends?days=7'),
        api.get('/analytics/diagnosis-correlation'),
        api.get('/analytics/treatment-efficacy'),
        api.get('/analytics/temporal-patterns?hours=24')
      ])
      setPopStats(pop.data)
      setRiskTrends(trends.data)
      setDiagnosisCorr(diag.data.slice(0, 10))
      setTreatmentEff(treatment.data.slice(0, 8))
      setTemporalPatterns(temporal.data)
    } catch (err) {
      console.error('Error loading analytics:', err)
    }
  }

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white px-6 py-8 rounded-xl shadow-xl animate-slideInUp">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h1 className="text-3xl font-bold">Retrospective Analytics & Population Health</h1>
        </div>
        <p className="text-blue-100">Evidence-based insights across patient populations</p>
      </div>

      {/* Population Statistics */}
      {popStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideInLeft" style={{animationDelay: '0.1s'}}>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold opacity-90">Total Patients</div>
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold animate-countUp">{popStats.total_patients}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold opacity-90">Average Age</div>
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-4xl font-bold animate-countUp">{popStats.average_age.toFixed(1)}</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold opacity-90">High Risk Patients</div>
              <svg className="w-6 h-6 opacity-80 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-4xl font-bold animate-countUp">{popStats.high_risk_count}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold opacity-90">Avg Risk Score</div>
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-4xl font-bold animate-countUp">{(popStats.average_risk_score * 100).toFixed(0)}%</div>
          </div>
        </div>
      )}

      {/* Gender & Unit Distribution */}
      {popStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={Object.entries(popStats.gender_distribution).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.keys(popStats.gender_distribution).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              ICU Unit Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(popStats.unit_distribution).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Risk Trends Over Time */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-slideInLeft" style={{animationDelay: '0.3s'}}>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Risk Trends (7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" domain={[0, 1]} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="average_risk" stroke="#3b82f6" name="Avg Risk" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="high_risk_count" stroke="#ef4444" name="High Risk Count" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Diagnosis Risk Correlation */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-slideInRight" style={{animationDelay: '0.4s'}}>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Risk by Diagnosis (Top 10)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={diagnosisCorr} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 1]} />
            <YAxis dataKey="icd10_code" type="category" width={80} />
            <Tooltip content={({ payload }) => {
              if (payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 border-2 border-orange-300 rounded-lg shadow-lg">
                    <div className="font-bold text-gray-800">{data.icd10_code}</div>
                    <div className="text-sm text-gray-600">{data.description}</div>
                    <div className="text-sm font-semibold text-orange-600 mt-1">Risk: {(data.average_risk * 100).toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Patients: {data.patient_count}</div>
                  </div>
                )
              }
              return null
            }} />
            <Bar dataKey="average_risk" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Treatment Efficacy */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow animate-slideInUp" style={{animationDelay: '0.5s'}}>
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white px-6 py-4 rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Treatment Efficacy Analysis
          </h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-bold text-gray-700">Medication</th>
                <th className="text-right p-3 font-bold text-gray-700">Patients</th>
                <th className="text-right p-3 font-bold text-gray-700">Initial Risk</th>
                <th className="text-right p-3 font-bold text-gray-700">Final Risk</th>
                <th className="text-right p-3 font-bold text-gray-700">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {treatmentEff.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium">{item.medication_name}</td>
                  <td className="text-right p-3">{item.patient_count}</td>
                  <td className="text-right p-3">{(item.average_initial_risk * 100).toFixed(0)}%</td>
                  <td className="text-right p-3">{(item.average_final_risk * 100).toFixed(0)}%</td>
                  <td className={`text-right p-3 font-bold ${item.improvement_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.improvement_percentage > 0 ? '+' : ''}{item.improvement_percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temporal Patterns */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow animate-slideInLeft" style={{animationDelay: '0.6s'}}>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Temporal Patterns (24 Hours)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={temporalPatterns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="average_heart_rate" stroke="#ef4444" name="HR" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="average_spo2" stroke="#10b981" name="SpO2" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="deterioration_count" stroke="#f59e0b" name="Deterioration Events" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
