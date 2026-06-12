import React from 'react'

export default function AlertsPanel({ alerts }) {
  if (!alerts?.length) return (
    <div className="bg-white rounded border p-3">No high-risk alerts.</div>
  )
  return (
    <div className="bg-white rounded border">
      {alerts.map(a => (
        <div key={a.patient_id} className="p-3 border-b last:border-b-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Patient {a.patient_id}</div>
              <div className="text-sm text-gray-600">{a.message}</div>
            </div>
            <div className={`text-sm font-semibold ${a.risk_level === 'high' ? 'text-red-600' : a.risk_level === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
              {(a.risk_score*100).toFixed(0)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
