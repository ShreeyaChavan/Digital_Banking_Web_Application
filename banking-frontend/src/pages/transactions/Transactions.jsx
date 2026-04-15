import { useState } from 'react'
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { formatCurrency, formatDate } from '../../utils/formatters'

const txns = [
  { id: 1,  name: 'Salary Credit',     amount:  72000, type: 'credit', date: '2024-03-01', category: 'Income',    ref: 'TXN202403010001' },
  { id: 2,  name: 'Amazon Purchase',   amount:   3499, type: 'debit',  date: '2024-03-03', category: 'Shopping',  ref: 'TXN202403030002' },
  { id: 3,  name: 'Rent Payment',      amount:  18000, type: 'debit',  date: '2024-03-05', category: 'Housing',   ref: 'TXN202403050003' },
  { id: 4,  name: 'Freelance Income',  amount:  15000, type: 'credit', date: '2024-03-08', category: 'Income',    ref: 'TXN202403080004' },
  { id: 5,  name: 'Electricity Bill',  amount:   2200, type: 'debit',  date: '2024-03-10', category: 'Utilities', ref: 'TXN202403100005' },
  { id: 6,  name: 'Swiggy Order',      amount:    450, type: 'debit',  date: '2024-03-11', category: 'Food',      ref: 'TXN202403110006' },
  { id: 7,  name: 'Mutual Fund SIP',   amount:  10000, type: 'debit',  date: '2024-03-12', category: 'Savings',   ref: 'TXN202403120007' },
  { id: 8,  name: 'Cashback Reward',   amount:    234, type: 'credit', date: '2024-03-13', category: 'Reward',    ref: 'TXN202403130008' },
]

export default function Transactions() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const filtered = txns.filter((t) => {
    const matchType   = filter === 'all' || t.type === filter
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.ref.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">{txns.length} transactions this month</p>
        </div>
        <Button variant="outline"><Download size={16} /> Export</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search by name or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'credit', 'debit'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                  ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Transaction', 'Reference', 'Date', 'Category', 'Amount', 'Type'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${txn.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                        {txn.type === 'credit'
                          ? <ArrowDownLeft size={14} className="text-green-600" />
                          : <ArrowUpRight  size={14} className="text-red-500" />}
                      </div>
                      <span className="font-medium text-slate-800">{txn.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-400">{txn.ref}</td>
                  <td className="py-3 pr-4 text-slate-500">{formatDate(txn.date)}</td>
                  <td className="py-3 pr-4"><Badge variant="default">{txn.category}</Badge></td>
                  <td className={`py-3 pr-4 font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </td>
                  <td className="py-3">
                    <Badge variant={txn.type === 'credit' ? 'success' : 'danger'}>{txn.type}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-sm">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}