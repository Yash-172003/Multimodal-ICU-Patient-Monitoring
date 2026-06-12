import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Timeline({ predictions }) {
  const data = (predictions || []).map(p => ({
    time: new Date(p.timestamp).toLocaleString([], {hour: '2-digit', minute: '2-digit', month:'short', day:'2-digit'}),
    risk: p.risk_score,
  }))
  return (
    <div className="w-full h-64 bg-white rounded border p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis domain={[0,1]} />
          <Tooltip />
          <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
