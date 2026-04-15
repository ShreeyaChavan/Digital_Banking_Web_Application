import { useState, useEffect } from 'react'
import api from '../../api/axiosInstance'
import { PlusCircle, Eye, Download, Copy } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'



export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [showNumbers, setShowNumbers] = useState({})
  

   useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts')
        setAccounts(res.data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const createAccount = async () => {
  try {
    const res = await api.post('/accounts', {
      accountType: 'Savings'
    })

    setAccounts(prev => [...prev, res.data])
    toast.success('Account created!')
  } catch (err) {
    toast.error('Failed to create account')
  }
}

  const toggleNumber = (id) => setShowNumbers((prev) => ({ ...prev, [id]: !prev[id] }))
  const copyNumber   = (num) => { navigator.clipboard.writeText(num); toast.success('Account number copied!') }

  const viewMiniStatement = async (id) => {
  try {
    const res = await api.get(`/accounts/${id}/transactions`)
    console.log("API RESPONSE:", res.data) 
    setTransactions(res.data)
  } catch {
    toast.error('Failed to fetch transactions')
  }
}

const downloadStatement = async (id) => {
  try {
    const res = await api.get(`/accounts/${id}/statement`)

    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'statement.json'
    a.click()

    toast.success('Downloaded!')
  } catch {
    toast.error('Download failed')
  }
}

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your bank accounts</p>
        </div>
        <Button onClick={createAccount}>
          <PlusCircle size={16} /> Open new account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <Card key={acc.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{acc.accountType}</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">{formatCurrency(acc.balance)}</p>
              </div>
              <Badge variant="success">{acc.status}</Badge>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm font-mono text-slate-700">
                {showNumbers[acc.id] ? acc.accountNumber.replace(/(\d{4})/g, '$1 ').trim() : 'xxxx xxxx xxxx ' + acc.accountNumber.slice(-4)}
                
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleNumber(acc.id)} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
                  <Eye size={14} className="text-slate-500" />
                </button>
                <button onClick={() => copyNumber(acc.accountNumber)} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
                  <Copy size={14} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">IFSC Code</p><p className="font-medium text-slate-700 mt-0.5">{acc.ifscCode}</p></div>
              <div><p className="text-xs text-slate-400">Branch</p><p className="font-medium text-slate-700 mt-0.5">{acc.branch}</p></div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => viewMiniStatement(acc.id)}>
                <Eye size={14} /> Mini statement
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => downloadStatement(acc.id)} >
                <Download size={14} /> Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

        {transactions.length === 0 && (
  <p className="mt-4 text-gray-500">No transactions found</p>
)}

      {transactions.length > 0 && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold">Mini Statement</h2>

    {transactions.map((tx) => (
      <div key={tx.id} className="border p-2 rounded mt-2">
        <p>{tx.type} - ₹{tx.amount}</p>
        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
      </div>
    ))}
  </div>
)}
    </div>
  )
}



/*import { useState } from 'react'
import { PlusCircle, Eye, Download, Copy } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

const accounts = [
  { id: 1, type: 'Savings Account',  number: '1234567890123456', balance: 142680, ifsc: 'NEOБ0001234', branch: 'Pune Main',   status: 'Active' },
  { id: 2, type: 'Current Account', number: '9876543210987654', balance:  43740, ifsc: 'NEOB0001234', branch: 'Shrigonda', status: 'Active' },
]

export default function Accounts() {
  const [showNumbers, setShowNumbers] = useState({})

  const toggleNumber = (id) => setShowNumbers((prev) => ({ ...prev, [id]: !prev[id] }))
  const copyNumber   = (num) => { navigator.clipboard.writeText(num); toast.success('Account number copied!') }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your bank accounts</p>
        </div>
        <Button>
          <PlusCircle size={16} /> Open new account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <Card key={acc.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{acc.accountType}</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">{formatCurrency(acc.balance)}</p>
              </div>
              <Badge variant="success">{acc.status}</Badge>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm font-mono text-slate-700">
                {showNumbers[acc.id] ? acc.accountNumber.replace(/(\d{4})/g, '$1 ').trim() : 'xxxx xxxx xxxx ' + acc.accountNumber.slice(-4)}
                
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleNumber(acc.id)} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
                  <Eye size={14} className="text-slate-500" />
                </button>
                <button onClick={() => copyNumber(acc.accountNumber)} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
                  <Copy size={14} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">IFSC Code</p><p className="font-medium text-slate-700 mt-0.5">{acc.ifscCode}</p></div>
              <div><p className="text-xs text-slate-400">Branch</p><p className="font-medium text-slate-700 mt-0.5">{acc.branchName}</p></div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye size={14} /> Mini statement
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download size={14} /> Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}*/