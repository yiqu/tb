import { cn } from '@/lib/utils';

export default function PageLayout2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={ cn(`mt-6 flex h-full w-full flex-col`, className) }>{ children }</section>;
}
