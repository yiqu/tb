import { cn } from '@/lib/utils';

export default function ColumnStack({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={ cn('flex flex-col', className) }>{ children }</div>;
}
