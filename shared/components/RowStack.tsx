import { cn } from '@/lib/utils';

export default function RowStack({ children, className }: Readonly<{ children?: React.ReactNode; className?: string }>) {
  return <div className={ cn('flex flex-row', className) }>{ children }</div>;
}
