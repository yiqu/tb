import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function DisplayCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Card className={ cn('h-full w-full rounded-md px-6 py-6', className) }>{ children }</Card>;
}
