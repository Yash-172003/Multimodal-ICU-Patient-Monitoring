import React from 'react'
import { Link } from 'react-router-dom'
import PredictionBadge from './PredictionBadge'

export default function PatientCard({ p }) {
  return (
    <Link 
      to={`/patients/${p.id}`} 
      className="block bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-5 hover:border-blue-400 hover:shadow-2xl transform transition-all duration-300 hover:scale-105 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
            <div className="text-xs text-gray-500 font-medium">MRN {p.mrn}</div>
          </div>
        </div>
        <PredictionBadge score={p.latest_prediction?.risk_score ?? 0} level={p.latest_prediction?.risk_level ?? 'low'} />
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {p.gender}
        </span>
        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {p.age}y
        </span>
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {p.unit}/{p.bed_id}
        </span>
      </div>

      {p.latest_vitals && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
            <div className="text-xs text-red-600 font-semibold mb-1">Heart Rate</div>
            <div className="text-xl font-bold text-red-700">{Math.round(p.latest_vitals.heart_rate)}</div>
            <div className="text-xs text-red-500">bpm</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 font-semibold mb-1">Blood Pressure</div>
            <div className="text-xl font-bold text-blue-700">{Math.round(p.latest_vitals.systolic_bp)}/{Math.round(p.latest_vitals.diastolic_bp)}</div>
            <div className="text-xs text-blue-500">mmHg</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 font-semibold mb-1">SpO₂</div>
            <div className="text-xl font-bold text-green-700">{Math.round(p.latest_vitals.spo2)}%</div>
            <div className="text-xs text-green-500">oxygen</div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-end text-blue-600 font-semibold text-sm group-hover:text-blue-700">
        <span>View Details</span>
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
