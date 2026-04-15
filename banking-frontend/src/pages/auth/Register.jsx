import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Landmark } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import api from '../../api/axiosInstance'
import useAuthStore from '../../store/authStore'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', data)
      toast.success('Account created successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    /*const mockUser = { name: data.name, email: data.email, phone: data.phone }
    toast.success('Account created! Please login.')
    navigate('/login')*/
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Landmark size={18} className="text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-xl">NeoBank</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Start banking with NeoBank today</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Rahul Sharma"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="9876543210"
            error={errors.phone?.message}
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid Indian mobile number' }
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (v) => v === watch('password') || 'Passwords do not match'
            })}
          />

          <Button type="submit" loading={isSubmitting} className="w-full mt-1">
            Create account
          </Button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}