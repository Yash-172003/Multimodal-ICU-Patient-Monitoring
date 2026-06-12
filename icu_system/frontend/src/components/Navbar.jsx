import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <div className="w-full h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="font-semibold">ICU Monitoring Dashboard</div>
      <div className="flex items-center gap-3">
        <button
          className="text-sm text-red-600 hover:underline"
          onClick={() => {
            localStorage.removeItem('token')
            navigate('/login')
          }}
        >Logout</button>
      </div>
    </div>
  )
}
