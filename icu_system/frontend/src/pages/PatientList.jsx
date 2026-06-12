import React, { useEffect, useState } from 'react'
import { api } from '../shared/api'
import PatientCard from '../components/PatientCard'

function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay)
    return () => clearInterval(id)
  }, [callback, delay])
}

export default function PatientList() {
  const [list, setList] = useState([])

  const load = async () => {
    const res = await api.get('/patients/')
    setList(res.data)
  }

  useEffect(() => { load() }, [])
  useInterval(load, 30000)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-xl shadow-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 animate-slideInLeft">Patient Monitoring</h1>
            <p className="text-teal-100 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              {list.length} patients currently in ICU
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((p, index) => (
          <div 
            key={p.id} 
            className="animate-slideInUp"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <PatientCard p={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
