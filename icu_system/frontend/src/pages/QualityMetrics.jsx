import React, { useState, useEffect } from 'react'
import { api } from '../shared/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

export default function QualityMetrics() {
  const [retrospective, setRetrospective] = useState(null)
  const [treatmentEfficacy, setTreatmentEfficacy] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const [retro, treatment] = await Promise.all([
        api.get('/analytics/retrospective-summary?days=30'),
        api.get('/analytics/treatment-efficacy')
      ])
      console.log('Retrospective data:', retro.data)
      setRetrospective(retro.data)
      setTreatmentEfficacy(treatment.data.slice(0, 12))
    } catch (err) {
      console.error('Error loading quality metrics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading quality metrics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Metrics</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadMetrics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!retrospective) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">No data available</p>
      </div>
    )
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Quality Improvement & Performance Metrics</h1>
        <p className="text-blue-100">Comprehensive analysis of clinical outcomes and quality indicators</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Analysis Period: Last 30 Days</span>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Patients</div>
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-900">{retrospective.total_patients}</div>
          <div className="text-sm text-blue-600 mt-2">Monitored patients</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-red-700 uppercase tracking-wide">High Risk</div>
            <div className="bg-red-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-red-900">{retrospective.high_risk_percentage.toFixed(1)}%</div>
          <div className="text-sm text-red-600 mt-2">{retrospective.high_risk_patients} patients at risk</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">Risk Reduction</div>
            <div className="bg-green-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-green-900">{retrospective.risk_improvement.toFixed(1)}%</div>
          <div className="text-sm text-green-600 mt-2">Average improvement</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Active Diagnoses</div>
            <div className="bg-purple-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-purple-900">{retrospective.total_diagnoses}</div>
          <div className="text-sm text-purple-600 mt-2">Total diagnoses tracked</div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Key Performance Indicators</h3>
          <p className="text-sm text-gray-600 mt-1">Critical metrics for quality assessment</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Treatment Engagement */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-blue-700 uppercase">Treatment</div>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-blue-900">{retrospective.treatment_coverage.toFixed(1)}%</span>
                <span className="text-sm text-blue-600 mb-1">coverage</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(retrospective.treatment_coverage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-3">Patients receiving medications</p>
            </div>

            {/* Procedures */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-green-700 uppercase">Procedures</div>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-green-900">{retrospective.total_procedures}</span>
                <span className="text-sm text-green-600 mb-1">total</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-600 to-green-500 h-3 rounded-full" 
                  style={{ width: `${Math.min((retrospective.total_procedures / retrospective.total_patients) * 20, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-700 mt-3">{(retrospective.total_procedures / retrospective.total_patients).toFixed(1)} per patient</p>
            </div>

            {/* Interventions */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-orange-700 uppercase">Interventions</div>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-orange-900">{retrospective.total_interventions}</span>
                <span className="text-sm text-orange-600 mb-1">total</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-600 to-orange-500 h-3 rounded-full" 
                  style={{ width: `${Math.min((retrospective.total_interventions / retrospective.total_patients) * 25, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-700 mt-3">{(retrospective.total_interventions / retrospective.total_patients).toFixed(1)} per patient</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Diagnoses */}
        {retrospective.most_common_diagnoses && retrospective.most_common_diagnoses.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Top Diagnoses</h3>
              <p className="text-sm text-gray-600 mt-1">Most frequent conditions</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={retrospective.most_common_diagnoses.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="icd10_code" type="category" width={70} stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                            <div className="font-bold text-purple-700">{data.icd10_code}</div>
                            <div className="text-sm text-gray-700 mt-1">{data.description}</div>
                            <div className="text-sm font-semibold text-purple-600 mt-2">Count: {data.count}</div>
                          </div>
                        )
                      }
                      return null
                    }} 
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {retrospective.most_common_diagnoses.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Most Frequent Procedures */}
        {retrospective.most_frequent_procedures && retrospective.most_frequent_procedures.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Procedure Volume</h3>
              <p className="text-sm text-gray-600 mt-1">High-frequency procedures</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {retrospective.most_frequent_procedures.slice(0, 6).map((proc, idx) => {
                  const maxCount = Math.max(...retrospective.most_frequent_procedures.map(p => p.count))
                  const percentage = (proc.count / maxCount) * 100
                  return (
                    <div key={idx} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {proc.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">CPT: {proc.cpt_code}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-indigo-600">{proc.count}</div>
                          <div className="text-xs text-gray-500">procedures</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Treatment Efficacy */}
      {treatmentEfficacy.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Treatment Efficacy Benchmarks</h3>
            <p className="text-sm text-gray-600 mt-1">Medication effectiveness and quality grades</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left p-4 font-bold text-gray-700">Medication</th>
                    <th className="text-right p-4 font-bold text-gray-700">Patients</th>
                    <th className="text-right p-4 font-bold text-gray-700">Pre-Rx</th>
                    <th className="text-right p-4 font-bold text-gray-700">Post-Rx</th>
                    <th className="text-right p-4 font-bold text-gray-700">Efficacy</th>
                    <th className="text-center p-4 font-bold text-gray-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {treatmentEfficacy.map((item, idx) => {
                    const efficacy = item.improvement_percentage
                    const grade = efficacy > 15 ? 'A' : efficacy > 10 ? 'B' : efficacy > 5 ? 'C' : efficacy > 0 ? 'D' : 'F'
                    const gradeConfig = {
                      'A': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
                      'B': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
                      'C': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
                      'D': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
                      'F': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
                    }[grade]

                    return (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-gray-900">{item.medication_name}</td>
                        <td className="text-right p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                            {item.patient_count}
                          </span>
                        </td>
                        <td className="text-right p-4 text-gray-700">{(item.average_initial_risk * 100).toFixed(1)}%</td>
                        <td className="text-right p-4 text-gray-700">{(item.average_final_risk * 100).toFixed(1)}%</td>
                        <td className={`text-right p-4 font-bold ${efficacy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {efficacy > 0 ? '+' : ''}{efficacy.toFixed(1)}%
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-4 py-2 rounded-lg font-bold text-lg border-2 ${gradeConfig.bg} ${gradeConfig.text} ${gradeConfig.border}`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Grading Scale:</strong> 
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs">A</span> {'>'}15% 
                </span>
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-xs">B</span> 10-15%
                </span>
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-xs">C</span> 5-10%
                </span>
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-semibold text-xs">D</span> 0-5%
                </span>
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-semibold text-xs">F</span> Negative
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quality Improvement Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Quality Improvement Recommendations</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-blue-600 text-xl mt-0.5">•</span>
                <span className="text-gray-700">
                  <strong className="text-blue-700">High-Risk Focus:</strong> {retrospective.high_risk_percentage.toFixed(1)}% of patients are high risk - implement enhanced monitoring
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-blue-600 text-xl mt-0.5">•</span>
                <span className="text-gray-700">
                  <strong className="text-blue-700">Medication Optimization:</strong> Review Grade D/F medications for protocol refinement
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-blue-600 text-xl mt-0.5">•</span>
                <span className="text-gray-700">
                  <strong className="text-blue-700">Early Intervention:</strong> Implement proactive strategies for top diagnoses
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-blue-600 text-xl mt-0.5">•</span>
                <span className="text-gray-700">
                  <strong className="text-blue-700">Documentation Quality:</strong> Enhance nursing assessment compliance
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
