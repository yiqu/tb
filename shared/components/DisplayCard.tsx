import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface DisplayCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DisplayCard({ children, className, ...props }: DisplayCardProps & React.ComponentProps<'div'>) {
  return (
    <Card className={ cn('rounded-md', className) } { ...props }>
      { children }
    </Card>
  );
}
