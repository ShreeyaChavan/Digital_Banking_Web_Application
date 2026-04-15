import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Landmark } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  
  
    /*try {
      const res = await api.post('/auth/login', data)
      login(res.data.user, res.data.token)
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }*/
  

    const onSubmit = async (data) => {
  try {
    const res = await api.post('/auth/login', data)
    login(res.data.user, res.data.token)
    toast.success('Logged in successfully!')
    navigate('/dashboard')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid email or password')
  }
}

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Landmark size={18} className="text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-xl">NeoBank</span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full mt-1">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}