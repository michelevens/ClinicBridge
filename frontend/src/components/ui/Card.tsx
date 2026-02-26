import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'glass' | 'clinical' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700',
  glass: 'glass',
  clinical: 'glass-clinical',
  elevated: 'bg-white shadow-premium dark:bg-slate-900',
};

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-2xl', variantStyles[variant], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-b border-slate-100 px-6 py-4 dark:border-slate-700/50', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-t border-slate-100 px-6 py-4 dark:border-slate-700/50',
        className,
      )}
      {...props}
    />
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-slate-400', className)} {...props} />
  );
}
