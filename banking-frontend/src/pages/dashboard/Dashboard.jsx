import { useEffect, useState } from 'react'
import { Landmark, TrendingUp, ArrowUpRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    api.get('/accounts').then((res) => setAccounts(res.data)).catch(() => {})
    api.get('/transactions').then((res) => setTransactions(res.data.slice(0, 5))).catch(() => {})
  }, [])

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back, <span className="font-semibold">{user?.name}</span> 👋
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Balance', value: formatCurrency(totalBalance || 0), icon: Landmark, color: "bg-blue-50 text-blue-600" },
          { label: 'Total Accounts', value: accounts.length, icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: 'Recent Activity', value: transactions.length, icon: ArrowUpRight, color: "bg-purple-50 text-purple-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick actions</h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Transfer', action: () => navigate('/transfer'), color: 'bg-blue-50 text-blue-700' },
            { label: 'Pay Bill', action: () => {}, color: 'bg-purple-50 text-purple-700' },
            { label: 'Deposit', action: () => {}, color: 'bg-green-50 text-green-700' },
            { label: 'Statement', action: () => navigate('/transactions'), color: 'bg-amber-50 text-amber-700' },
          ].map(({ label, action, color }) => (
            <button
              key={label}
              onClick={action}
              className={`${color} rounded-xl py-4 text-sm font-medium hover:scale-105 transition-all`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ACCOUNTS SUMMARY */}
        <div className="mt-5 pt-4 border-t">
          <p className="text-xs text-slate-500 mb-2">Your accounts</p>

          {accounts.length === 0 ? (
            <p className="text-sm text-slate-400">No accounts found</p>
          ) : (
            accounts.map((acc) => (
              <div key={acc.id} className="flex justify-between items-center py-2">
                <p className="text-sm text-slate-700">{acc.accountType}</p>
                <p className="text-sm font-semibold">{formatCurrency(acc.balance)}</p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* RECENT TRANSACTIONS */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Recent transactions</h2>
          <span
            onClick={() => navigate('/transactions')}
            className="text-xs text-blue-600 cursor-pointer hover:underline"
          >
            View all
          </span>
        </div>

        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No transactions yet</p>
        ) : (
          <div className="flex flex-col divide-y">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3">

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center
                    ${txn.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {txn.description || 'Transaction'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(txn.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <Badge variant={txn.type === 'credit' ? 'success' : 'danger'}>
                    {txn.type}
                  </Badge>
                </div>

              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  )
}
/*import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Landmark, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'
import { useNavigate } from 'react-router-dom'

const spendData = [
  { month: 'Oct', income: 52000, expense: 34000 },
  { month: 'Nov', income: 48000, expense: 29000 },
  { month: 'Dec', income: 61000, expense: 41000 },
  { month: 'Jan', income: 55000, expense: 38000 },
  { month: 'Feb', income: 67000, expense: 44000 },
  { month: 'Mar', income: 72000, expense: 51000 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    api.get('/accounts').then((res) => setAccounts(res.data)).catch(() => {})
    api.get('/transactions').then((res) => setTransactions(res.data.slice(0, 5))).catch(() => {})
  }, [])

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome, <span className="font-medium text-slate-800">{user?.name}</span>! Here's your financial overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Balance',    value: formatCurrency(totalBalance || 1000), change: '+2.4%', up: true,  icon: Landmark },
          { label: 'Monthly Income',   value: formatCurrency(72000),  change: '+7.5%', up: true,  icon: TrendingUp },
          { label: 'Monthly Expense',  value: formatCurrency(51000),  change: '+4.1%', up: false, icon: TrendingDown },
          { label: 'Savings Rate',     value: '29.2%',                change: '+1.2%', up: true,  icon: ArrowUpRight },
        ].map(({ label, value, change, up, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-slate-500">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${up ? 'bg-green-50' : 'bg-red-50'}`}>
                <Icon size={16} className={up ? 'text-green-600' : 'text-red-500'} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
            <p className={`text-xs mt-1 font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
              {change} vs last month
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={spendData}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="income"  stroke="#3b82f6" fill="url(#income)"  strokeWidth={2} name="Income" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expense)" strokeWidth={2} name="Expense" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Transfer',  color: 'bg-blue-50 text-blue-700',   action: () => navigate('/transfer') },
{ label: 'Pay Bill',  color: 'bg-purple-50 text-purple-700', action: () => {} },
{ label: 'Deposit',   color: 'bg-green-50 text-green-700',  action: () => {} },
{ label: 'Statement', color: 'bg-amber-50 text-amber-700',  action: () => navigate('/transactions') },
            ].map(({ label, color, action }) => (
              <button key={label} onClick={action} className={`${color} rounded-xl py-4 text-sm font-medium hover:opacity-80 transition-opacity`}>
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Your accounts</p>
            {accounts.map((acc) => (
              <div key={acc.id} className="flex justify-between items-center py-1.5">
                <p className="text-xs text-slate-600">{acc.accountType}</p>
                <p className="text-xs font-semibold text-slate-800">{formatCurrency(acc.balance)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Recent transactions</h2>
          <a href="/transactions" className="text-xs text-blue-600 hover:underline">View all</a>
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No transactions yet</p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
                    ${txn.type === 'credit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{txn.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(txn.createdAt)} · {txn.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <Badge variant={txn.type === 'credit' ? 'success' : 'danger'}>
                    {txn.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}*/
