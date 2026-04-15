import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../utils/formatters'
import api from '../../api/axiosInstance'

export default function Transfer() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [step, setStep] = useState(1)
  const [transferData, setTransferData] = useState(null)
  const [receipt, setReceipt] = useState(null)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const selectedAccountId = watch('fromAccountId')
  const selectedAccount = accounts.find(a => a.id === selectedAccountId)

  useEffect(() => {
    api.get('/accounts').then(res => setAccounts(res.data)).catch(() => {})
  }, [])

  const onReview = (data) => {
    setTransferData(data)
    setStep(2)
  }

  const onConfirm = async () => {
    try {
      const res = await api.post('/transactions/transfer', {
        fromAccountId: transferData.fromAccountId,
        toAccountNumber: transferData.toAccountNumber,
        amount: Number(transferData.amount),
        description: transferData.description,
      })
      setReceipt(res.data)
      setStep(3)
      toast.success('Transfer successful!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed')
      setStep(1)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Fund transfer</h1>
        <p className="text-sm text-slate-500 mt-0.5">Transfer money to any bank account</p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {['Enter details', 'Review', 'Done'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
              ${step > i + 1 ? 'bg-green-500 text-white' :
                step === i + 1 ? 'bg-blue-600 text-white' :
                'bg-slate-100 text-slate-400'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
              {label}
            </span>
            {i < 2 && <div className="w-8 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <form onSubmit={handleSubmit(onReview)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">From account</label>
              <select
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-slate-800"
                {...register('fromAccountId', { required: 'Please select an account' })}
              >
                <option value="">Select account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountType} — {formatCurrency(acc.balance)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && (
                <p className="text-xs text-red-500">{errors.fromAccountId.message}</p>
              )}
            </div>

            {selectedAccount && (
              <div className="bg-blue-50 rounded-lg px-4 py-3 flex justify-between items-center">
                <p className="text-sm text-blue-700">Available balance</p>
                <p className="text-sm font-semibold text-blue-800">
                  {formatCurrency(selectedAccount.balance)}
                </p>
              </div>
            )}

            <Input
              label="Beneficiary account number"
              placeholder="16-digit account number"
              error={errors.toAccountNumber?.message}
              {...register('toAccountNumber', {
                required: 'Account number is required',
                minLength: { value: 10, message: 'Enter valid account number' }
              })}
            />

            <Input
              label="Amount (₹)"
              type="number"
              placeholder="Enter amount"
              error={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Minimum ₹1' },
                validate: v => !selectedAccount ||
                  Number(v) <= selectedAccount.balance || 'Insufficient balance'
              })}
            />

            <Input
              label="Description (optional)"
              placeholder="e.g. Rent payment"
              {...register('description')}
            />

            <Button type="submit" className="w-full mt-1">
              Review transfer <ArrowRight size={16} />
            </Button>
          </form>
        </Card>
      )}

      {step === 2 && transferData && (
        <Card>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Review transfer details</h2>
          <div className="flex flex-col divide-y divide-slate-100">
            {[
              { label: 'From',        value: accounts.find(a => a.id === transferData.fromAccountId)?.accountType },
              { label: 'To account',  value: transferData.toAccountNumber },
              { label: 'Amount',      value: formatCurrency(Number(transferData.amount)) },
              { label: 'Description', value: transferData.description || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-sm font-medium text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 rounded-lg px-4 py-3 mt-4 mb-5">
            <p className="text-xs text-amber-700">
              Please verify the account number before confirming. Transfers cannot be reversed.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Edit
            </Button>
            <Button className="flex-1" onClick={onConfirm} loading={isSubmitting}>
              Confirm transfer
            </Button>
          </div>
        </Card>
      )}

      {step === 3 && receipt && (
        <Card>
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={36} className="text-green-500" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Transfer successful!</h2>
            <p className="text-sm text-slate-500 mb-6">Your money has been sent successfully</p>

            <div className="w-full bg-slate-50 rounded-xl p-4 text-left flex flex-col gap-3">
              {[
                { label: 'Reference number', value: receipt.referenceNumber },
                { label: 'Amount',           value: formatCurrency(receipt.amount) },
                { label: 'Description',      value: receipt.description },
                { label: 'Status',           value: receipt.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-xs font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 w-full">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/transactions')}>
                View transactions
              </Button>
              <Button className="flex-1" onClick={() => { setStep(1); setReceipt(null) }}>
                New transfer
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}