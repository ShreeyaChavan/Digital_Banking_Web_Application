import clsx from 'clsx'

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={clsx('bg-white rounded-xl border border-slate-200 p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}