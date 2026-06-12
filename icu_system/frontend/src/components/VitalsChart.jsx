import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function formatData(vitals) {
  return vitals.map(v => ({
    time: new Date(v.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
    hr: v.heart_rate,
    sbp: v.systolic_bp,
    dbp: v.diastolic_bp,
    spo2: v.spo2,
    rr: v.respiratory_rate,
    temp: v.temperature,
  }))
}

export default function VitalsChart({ vitals }) {
  const data = formatData(vitals)
  return (
    <div className="w-full h-80 bg-white rounded border p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="hr" stroke="#ef4444" dot={false} name="HR" />
          <Line type="monotone" dataKey="sbp" stroke="#3b82f6" dot={false} name="SBP" />
          <Line type="monotone" dataKey="dbp" stroke="#60a5fa" dot={false} name="DBP" />
          <Line type="monotone" dataKey="spo2" stroke="#10b981" dot={false} name="SpO2" />
          <Line type="monotone" dataKey="rr" stroke="#f59e0b" dot={false} name="RR" />
          <Line type="monotone" dataKey="temp" stroke="#8b5cf6" dot={false} name="Temp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
