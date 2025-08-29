import { ReactNode, ElementType } from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: 'default' | 'bare' | 'outline';
  padded?: boolean;
}

/**
 * Generic Card component using Tailwind utilities.
 * Variants:
 *  - default: dark panel with subtle gradient and border
 *  - outline: transparent bg with bordered frame
 *  - bare: no background, spacing only
 */
export default function Card({
  children,
  className,
  as: Tag = 'div',
  variant = 'default',
  padded = true,
  ...rest
}: CardProps) {
  const base = 'relative rounded-xl transition-shadow duration-400';
  const variants: Record<string,string> = {
    default: 'bg-dark/70 backdrop-blur-md border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_18px_-6px_rgba(0,0,0,0.6)]',
    outline: 'bg-transparent border border-magenta/40 hover:border-cyan/60',
    bare: 'bg-transparent'
  };
  return (
    <Tag className={clsx(base, variants[variant], padded && 'p-6', className)} {...rest}>
      {children}
    </Tag>
  );
}
