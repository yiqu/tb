'use client';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';

export default function FooterMenuContentWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <DropdownMenuContent
      className={ `w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg` }
      side={ isMobile ? 'bottom' : 'right' }
      align="end"
      sideOffset={ 4 }
    >
      { children }
    </DropdownMenuContent>
  );
}
