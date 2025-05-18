import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function DisplayCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Card className={ cn('h-full w-full rounded-md', className) }>{ children }</Card>;
}
