import { useState } from 'react'
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const cardData = [
  { id: 1, type: 'Debit Card',  network: 'Visa',       number: '4111111111114532', expiry: '09/27', holder: 'Rahul Sharma', blocked: false, limit: 50000,  spent: 21340 },
  { id: 2, type: 'Credit Card', network: 'Mastercard', number: '5500005555554444', expiry: '12/26', holder: 'Rahul Sharma', blocked: false, limit: 200000, spent: 67800 },
]

export default function Cards() {
  const [cards,      setCards]      = useState(cardData)
  const [showNums,   setShowNums]   = useState({})

  const toggleBlock = (id) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, blocked: !c.blocked } : c))
    const card = cards.find((c) => c.id === id)
    toast.success(card.blocked ? 'Card unblocked' : 'Card blocked successfully')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Cards</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your debit and credit cards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col gap-4">
            <div className={`rounded-2xl p-6 text-white relative overflow-hidden min-h-44
              ${card.blocked ? 'bg-slate-400' : card.type === 'Credit Card' ? 'bg-gradient-to-br from-slate-800 to-slate-600' : 'bg-gradient-to-br from-blue-700 to-blue-500'}`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs opacity-70 uppercase tracking-widest">{card.type}</p>
                  <p className="text-sm font-medium mt-0.5 opacity-90">{card.network}</p>
                </div>
                {card.blocked && <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Blocked</span>}
              </div>
              <p className="text-lg font-mono tracking-widest mb-4">
                {showNums[card.id]
                  ? card.number.replace(/(\d{4})/g, '$1 ').trim()
                  : `•••• •••• •••• ${card.number.slice(-4)}`}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-60">Card holder</p>
                  <p className="text-sm font-medium">{card.holder}</p>
                </div>
                <div>
                  <p className="text-xs opacity-60">Expires</p>
                  <p className="text-sm font-medium">{card.expiry}</p>
                </div>
              </div>
            </div>

            <Card>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Spent: ₹{card.spent.toLocaleString('en-IN')}</span>
                  <span>Limit: ₹{card.limit.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min((card.spent / card.limit) * 100, 100).toFixed(1)}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={card.blocked ? 'secondary' : 'danger'}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleBlock(card.id)}
                >
                  {card.blocked ? <><Unlock size={14} /> Unblock</> : <><Lock size={14} /> Block card</>}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowNums((p) => ({ ...p, [card.id]: !p[card.id] }))}
                >
                  {showNums[card.id] ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show number</>}
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}