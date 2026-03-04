import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface DisplayCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DisplayCard({ children, className }: DisplayCardProps) {
  return <Card className={ cn('h-full w-full min-w-0 rounded-md', className) }>{ children }</Card>;
}
