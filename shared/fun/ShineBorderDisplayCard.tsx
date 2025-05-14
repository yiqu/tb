import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ShineBorder } from '@/components/magicui/shine-border';

interface ShineBorderDisplayCardProps {
  children: React.ReactNode;
  className?: string;
  shineColor?: string[];
}

export default function ShineBorderDisplayCard({
  children,
  className,
  shineColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
}: ShineBorderDisplayCardProps) {
  return (
    <Card className={ cn(`
      relative h-full w-full overflow-hidden rounded-md px-6 py-6
    `, className) }>
      <ShineBorder shineColor={ shineColor } />
      { children }
    </Card>
  );
}
