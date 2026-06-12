import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../shared/api'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')  // correct default
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/login', { username, password })  // FIXED
      localStorage.setItem('token', res.data)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="h-full grid place-items-center">
      <form onSubmit={submit} className="bg-white p-6 rounded border w-80 space-y-3">
        <div className="text-lg font-semibold">Login</div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input className="w-full border rounded px-2 py-1"
            value={username}
            onChange={e=>setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password"
            className="w-full border rounded px-2 py-1"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 text-white rounded py-2">Sign in</button>
      </form>
    </div>
  )
}
