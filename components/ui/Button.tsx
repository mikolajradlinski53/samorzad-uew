import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  size?: 'default' | 'sm'
}

export function Button({
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-brand-hover',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:-translate-y-0.5',
  }

  const sizes = {
    default: 'px-8 py-3.5 text-base',
    sm:      'px-5 py-2 text-[0.85rem]',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
