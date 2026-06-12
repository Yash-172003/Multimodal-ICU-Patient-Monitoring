import axios from 'axios'

// In development, Vite proxy will handle /api -> http://localhost:8000
// In production (Docker), nginx will proxy /api to backend service
const baseURL = import.meta.env.DEV ? '/api' : '/api'

export const api = axios.create({
  baseURL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})
