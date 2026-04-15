import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Landmark, ArrowLeftRight,
  CreditCard, HandCoins, User, LogOut
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts',     icon: Landmark,        label: 'Accounts' },
  { to: '/transactions', icon: ArrowLeftRight,   label: 'Transactions' },
  { to: '/loans',        icon: HandCoins,        label: 'Loans' },
  { to: '/cards',        icon: CreditCard,       label: 'Cards' },
  { to: '/profile',      icon: User,             label: 'Profile' },
]

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col py-6 px-4 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Landmark size={16} className="text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-lg">NeoBank</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}