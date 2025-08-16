/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useOptimistic, useTransition } from 'react';
import { Plus, Calendar, ChevronRight, CalendarSync } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import useSideBarState from '@/hooks/useSideBarState';
import { Separator } from '@/components/ui/separator';
import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SIDEBAR_COLLAPSABLE_ADD_NEW } from '@/constants/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setSidebarCollapsableStateAction } from '@/server/sidebar/sidebar-actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuSub, SidebarMenuItem, SidebarMenuButton, SidebarMenuSubItem } from '@/components/ui/sidebar';

import SidebarMenuSubButtonParentWithActive from '../SidebarMenuSubButtonParentWithActive';

export default function AddNewParentItem({ collapsableState }: { collapsableState: SidebarCollapsableState }) {
  const [isPending, startTransition] = useTransition();
  const { isSidebarCollapsed } = useSideBarState();
  const [isCollapsedMenuOpen, setIsCollapsedMenuOpen] = useState(false);
  const isCollapsed: boolean = !!collapsableState[SIDEBAR_COLLAPSABLE_ADD_NEW];
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
        await setSidebarCollapsableStateAction(SIDEBAR_COLLAPSABLE_ADD_NEW, open);
      } catch (error) {
        setCollapsedStateOptimistic(isCollapsed);
      }
    });
  };

  // collapsed
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

  // Default view
  return (
    <Collapsible asChild open={ collapsedStateOptimistic } className={ `group/collapsible` } onOpenChange={ handleOnOpenChange }>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButtonV1>
            <Plus />
            <span>Add New</span>
            { isPending ?
              <Skeleton className="ml-auto h-4 w-4" />
            : <ChevronRight className={ `ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90` } /> }
          </SidebarMenuButtonV1>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            <AddNewItemsList />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function AddNewItemsList() {
  return (
    <>
      <SidebarMenuSubItem>
        <SidebarMenuSubButtonParentWithActive url="subscription">
          <Link href={ '/add/subscription' } prefetch className="flex items-center">
            <CalendarSync />
            <span>{ 'Subscription' }</span>
          </Link>
        </SidebarMenuSubButtonParentWithActive>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButtonParentWithActive url="bill">
          <Link href={ '/add/bill' } prefetch className="flex items-center">
            <Calendar />
            <span>{ 'Due Bill' }</span>
          </Link>
        </SidebarMenuSubButtonParentWithActive>
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
          New Subscription
        </Link>
      </div>
    </>
  );
}

function SidebarMenuButtonV1({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<'button'>) {
  //const pathname = usePathname();
  //const firstPath = pathname.split('/')[1] || ''; // add
  //const isActive = firstPath === 'add';

  return (
    <SidebarMenuButton className="cursor-pointer" { ...props }>
      { children }
    </SidebarMenuButton>
  );
}
