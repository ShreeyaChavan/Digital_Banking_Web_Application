import { Bell } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-slate-500">
        Welcome back, <span className="font-medium text-slate-800">{user?.name || 'User'}</span>
      </p>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}