/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { Suspense } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import FooterAvatarLogo from './FooterAvatarLogo';
import FooterAvatarText from './FooterAvatarText';

export function FooterMenuButton() {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className={ cn(`cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground`) }
      >
        <Suspense fallback={ <FooterAvatarLogoSuspended /> }>
          <FooterAvatarLogo />
        </Suspense>
        <Suspense fallback={ <FooterAvatarTextSuspended /> }>
          <FooterAvatarText />
        </Suspense>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}

function FooterAvatarLogoSuspended() {
  return <Skeleton className="size-8 rounded-full" />;
}

function FooterAvatarTextSuspended() {
  return (
    <section className="flex w-full flex-col gap-1">
      <Skeleton className="h-[17.5px] w-[100px]" />
      <Skeleton className="h-[12px] w-full" />
    </section>
  );
}
