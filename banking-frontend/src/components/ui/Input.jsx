import clsx from 'clsx'

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={clsx(
          'w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all',
          'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}