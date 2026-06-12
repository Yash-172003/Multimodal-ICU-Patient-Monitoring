import React, { useEffect, useState } from 'react'
import { api } from '../shared/api'
import AlertsPanel from '../components/AlertsPanel'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])

  const load = async () => {
    const s = await api.get('/dashboard/')
    setSummary(s.data)
    const a = await api.get('/alerts/')
    setAlerts(a.data)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 animate-slideInLeft">ICU Dashboard</h1>
        <p className="text-indigo-100 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          Real-time patient monitoring and alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slideInUp">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Patients</div>
            <div className="bg-blue-600 p-3 rounded-lg shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-900 animate-countUp">{summary?.patient_count ?? '—'}</div>
          <div className="mt-2 text-sm text-blue-600">Currently monitored</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border border-red-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-red-700 uppercase tracking-wide">High Risk</div>
            <div className="bg-red-600 p-3 rounded-lg shadow-md animate-pulse">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-red-900 animate-countUp">{summary?.high_risk_count ?? '—'}</div>
          <div className="mt-2 text-sm text-red-600">Require immediate attention</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Average Risk</div>
            <div className="bg-purple-600 p-3 rounded-lg shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-purple-900 animate-countUp">{summary ? Math.round(summary.average_risk*100) + '%' : '—'}</div>
          <div className="mt-2 text-sm text-purple-600">Population risk score</div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-6 py-4 mb-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
            {alerts.length > 0 && (
              <span className="ml-auto bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                {alerts.length}
              </span>
            )}
          </div>
        </div>
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  )
}
