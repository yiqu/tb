import { cn } from '@/lib/utils';

export default function PageLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={ cn(`flex h-full w-full flex-col`, className) }>{ children }</section>;
}
