import clsx from 'clsx'

export default function Button({ children, variant = 'primary', size = 'md', className = '', loading, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:scale-95',
    outline:   'border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-95',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={loading} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  )
}