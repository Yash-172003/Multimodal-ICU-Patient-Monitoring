import React from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : ''}`

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r p-3 hidden md:block">
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/patients" className={linkClass}>Patients</NavLink>
        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase">Analytics</div>
        <NavLink to="/analytics" className={linkClass}>Population Analytics</NavLink>
        <NavLink to="/protocols" className={linkClass}>Treatment Protocols</NavLink>
        <NavLink to="/quality" className={linkClass}>Quality Metrics</NavLink>
      </nav>
    </aside>
  )
}
