import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import { formatCurrency } from '../../utils/formatters'
import { Calculator } from 'lucide-react'
import api from '../../api/axiosInstance'
import toast from 'react-hot-toast'
/*
const loans = [
  { id: 1, type: 'Personal Loan', amount: 300000, outstanding: 187500, emi: 6250, tenure: '48 months', rate: '11.5%', nextDue: '2024-04-05', status: 'Active' },
]*/

export default function Loans() {
  const [principal, setPrincipal] = useState(500000)
  const [rate,      setRate]      = useState(10.5)
  const [tenure,    setTenure]    = useState(36)
  const [showForm, setShowForm] = useState(false)
const [loanAmount, setLoanAmount] = useState('')
const [loanType, setLoanType] = useState('Personal Loan')
const [loans, setLoans] = useState([])

  const monthlyRate = rate / 12 / 100
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) /
              (Math.pow(1 + monthlyRate, tenure) - 1)
  const totalPayment = emi * tenure
  const totalInterest = totalPayment - principal

  const applyLoan = async () => {
  try {
    await api.post('/loans', {
      amount: Number(loanAmount),
      type: loanType
    })

    toast.success('Loan applied successfully!')
    setShowForm(false)

  } catch (err) {
    console.error(err)
    toast.error('Failed to apply for loan')
  }
}

useEffect(() => {
  fetchLoans()
}, [])

const fetchLoans = async () => {
  try {
    const res = await api.get('/loans')
    setLoans(res.data)
  } catch {
    toast.error('Failed to fetch loans')
  }
}
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Loans</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your loans and applications</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Apply for loan</Button>
      </div>
        {showForm && (
  <Card>
    <h2 className="text-lg font-semibold mb-4">Apply for Loan</h2>

    <div className="grid gap-4">
      
      <Input
        label="Loan Amount"
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
      />

      <div>
        <label className="text-sm text-slate-500">Loan Type</label>
        <select
          className="w-full border rounded p-2 mt-1"
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
        >
          <option>Personal Loan</option>
          <option>Home Loan</option>
          <option>Education Loan</option>
        </select>
      </div>

      <Button onClick={applyLoan}>
        Submit Application
      </Button>
    </div>
  </Card>
)}
      {loans.map((loan) => {

  // 🎨 DUMMY CALCULATIONS
  const emi = loan.amount / 12
  const outstanding = loan.amount * 0.6
  const repaid = loan.amount - outstanding
  const progress = (repaid / loan.amount) * 100

  return (
    <Card key={loan.id}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {loan.type}
          </p>

          {/* ✅ REAL DATA */}
          <p className="text-2xl font-semibold text-slate-800 mt-1">
            {formatCurrency(loan.amount)}
          </p>
        </div>

        {/* ✅ REAL STATUS */}
        <Badge variant={
          loan.status === 'APPROVED' ? 'success' :
          loan.status === 'REJECTED' ? 'destructive' :
          'warning'
        }>
          {loan.status}
        </Badge>
      </div>

      {/* 🎨 FAKE BUT NICE UI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-400">Outstanding</p>
          <p className="font-semibold text-slate-800">
            {formatCurrency(outstanding)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Monthly EMI</p>
          <p className="font-semibold text-slate-800">
            {formatCurrency(emi)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Interest rate</p>
          <p className="font-semibold text-slate-800">10.5%</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Next due</p>
          <p className="font-semibold text-slate-800">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 🎨 PROGRESS BAR */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Repaid: {formatCurrency(repaid)}</span>
          <span>Outstanding: {formatCurrency(outstanding)}</span>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  )
})}

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Calculator size={18} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-700">EMI Calculator</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <Input label="Loan amount (₹)" type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
          <Input label="Interest rate (% per year)" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          <Input label="Tenure (months)" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Monthly EMI',     value: formatCurrency(isNaN(emi) ? 0 : Math.round(emi)) },
            { label: 'Total interest',  value: formatCurrency(isNaN(totalInterest) ? 0 : Math.round(totalInterest)) },
            { label: 'Total payment',   value: formatCurrency(isNaN(totalPayment) ? 0 : Math.round(totalPayment)) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium">{label}</p>
              <p className="text-xl font-semibold text-blue-800 mt-1">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}