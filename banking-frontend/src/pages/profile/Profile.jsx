import { useForm } from 'react-hook-form'
import { User, Shield, Bell } from 'lucide-react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Profile updated successfully!')
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your personal information</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-lg">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-500">{user?.email || 'email@example.com'}</p>
            <Badge variant="success" className="mt-1">Verified</Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <User size={15} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Personal information</span>
          </div>
          <Input label="Full name"      {...register('name')}  placeholder="Rahul Sharma" />
          <Input label="Email address"  {...register('email')} type="email" placeholder="you@example.com" />
          <Input label="Phone number"   {...register('phone')} type="tel" placeholder="9876543210" />
          <Button type="submit" loading={isSubmitting} className="w-fit mt-1">
            Save changes
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={15} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">KYC status</span>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { doc: 'Aadhaar Card',  status: 'Verified' },
            { doc: 'PAN Card',      status: 'Verified' },
            { doc: 'Photograph',    status: 'Pending' },
          ].map(({ doc, status }) => (
            <div key={doc} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <p className="text-sm text-slate-700">{doc}</p>
              <Badge variant={status === 'Verified' ? 'success' : 'warning'}>{status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={15} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Notification preferences</span>
        </div>
        <div className="flex flex-col gap-3">
          {[
            'Transaction alerts',
            'Low balance alerts',
            'Loan payment reminders',
            'Promotional offers',
          ].map((pref) => (
            <label key={pref} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-700">{pref}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}