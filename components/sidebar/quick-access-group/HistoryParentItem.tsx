/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { useOptimistic, useTransition } from 'react';
import { Plus, History, ChevronRight } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import useSideBarState from '@/hooks/useSideBarState';
import { Separator } from '@/components/ui/separator';
import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SIDEBAR_COLLAPSABLE_HISTORY } from '@/constants/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setSidebarCollapsableStateAction } from '@/server/sidebar/sidebar-actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuSub, SidebarMenuItem, SidebarMenuButton, SidebarMenuSubItem } from '@/components/ui/sidebar';

import SidebarMenuSubButtonHistoryParentWithActive from '../SidebarMenuSubButtonHistoryParentWithActive';

export default function HistoryParentItem({ collapsableState }: { collapsableState: SidebarCollapsableState }) {
  const [isPending, startTransition] = useTransition();
  const { isSidebarCollapsed } = useSideBarState();
  const [isCollapsedMenuOpen, setIsCollapsedMenuOpen] = useState(false);
  const isCollapsed: boolean = !!collapsableState[SIDEBAR_COLLAPSABLE_HISTORY];
  const [collapsedStateOptimistic, setCollapsedStateOptimistic] = useOptimistic(
    isCollapsed,
    (currentState: boolean, optimisticValue: boolean) => {
      return optimisticValue;
    },
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsCollapsedMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCollapsedMenuOpen(false);
    }, 100); // Small delay to prevent flickering
  };

  const handleOnOpenChange = async (open: boolean) => {
    startTransition(async () => {
      setCollapsedStateOptimistic(open);
      try {
        await setSidebarCollapsableStateAction(SIDEBAR_COLLAPSABLE_HISTORY, open);
      } catch (error) {
        setCollapsedStateOptimistic(isCollapsed);
      }
    });
  };

  // If collapsed and has items, use Popover for hover menu
  if (isSidebarCollapsed) {
    return (
      <SidebarMenuItem>
        <Popover open={ isCollapsedMenuOpen } onOpenChange={ setIsCollapsedMenuOpen }>
          <PopoverTrigger asChild>
            <SidebarMenuButtonV1 onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave } className="cursor-pointer">
              <Plus />
            </SidebarMenuButtonV1>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            className="max-h-[55rem] w-72 overflow-auto p-2"
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave }
          >
            <CollapsedMenuContent />
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    );
  }

  // Default collapsible behavior when not collapsed
  return (
    <Collapsible asChild open={ collapsedStateOptimistic } className={ `group/collapsible` } onOpenChange={ handleOnOpenChange }>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButtonV1>
            <History />
            <span>History</span>
            { isPending ?
              <Skeleton className="ml-auto h-4 w-4" />
            : <ChevronRight className={ `ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90` } /> }
          </SidebarMenuButtonV1>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            <MenuSubParent />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function MenuSubParent() {
  return (
    <>
      <SidebarMenuSubItem>
        <SidebarMenuSubButtonHistoryParentWithActive historyId="1">
          <Link href={ '/history/type-bill/1' } prefetch className="flex items-center">
            <History />
            <span>{ '1' }</span>
          </Link>
        </SidebarMenuSubButtonHistoryParentWithActive>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButtonHistoryParentWithActive historyId="2">
          <Link href={ '/history/type-subscription/2' } prefetch className="flex items-center">
            <History />
            <span>{ '2' }</span>
          </Link>
        </SidebarMenuSubButtonHistoryParentWithActive>
      </SidebarMenuSubItem>
    </>
  );
}

function CollapsedMenuContent() {
  return (
    <>
      <div className="mb-2 text-sm font-medium">Add New</div>
      <Separator className="my-1" />
      <div className="space-y-1">
        <Link href={ '' } className={ `flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground` }>
          1
        </Link>
      </div>
    </>
  );
}

function SidebarMenuButtonV1({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<'button'>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1] || ''; // add
  const isActive = firstPath === 'history';

  return (
    <SidebarMenuButton className="cursor-pointer" isActive={ isActive } { ...props }>
      { children }
    </SidebarMenuButton>
  );
}
