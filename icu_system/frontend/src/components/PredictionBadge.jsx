import React from 'react'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts'

export default function PredictionBadge({ score = 0, level = 'low' }) {
  const pct = Math.round((score || 0) * 100)
  const color = level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#10b981'
  
  // Calculate end angle based on percentage (360 degrees for 100%)
  const startAngle = 90
  const endAngle = startAngle - (pct / 100) * 360
  
  const data = [{ name: 'Risk', value: pct, fill: color }]
  
  return (
    <div className="w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="60%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={startAngle} 
          endAngle={endAngle}
        >
          <RadialBar 
            minAngle={0} 
            background 
            clockWise 
            dataKey="value" 
            cornerRadius={5}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="600" fill="#111827">{pct}%</text>
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center text-xs capitalize mt-1">{level} risk</div>
    </div>
  )
}
