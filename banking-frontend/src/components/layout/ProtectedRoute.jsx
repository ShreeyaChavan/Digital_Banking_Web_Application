import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" />

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}