'use client';

import { usePathname } from 'next/navigation';
import { Heart, ChevronRight } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { use, useRef, useState, useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import useSideBarState from '@/hooks/useSideBarState';
import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { SIDEBAR_COLLAPSABLE_FAVORITES } from '@/constants/constants';
import { revalidateFavoritesAll } from '@/server/favorites/favorites.server';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setSidebarCollapsableStateAction } from '@/server/sidebar/sidebar-actions';
import { SidebarMenuSub, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import FavoritesListSection from './FavoritesListSection';
import FavoritesListSectionCollapsed from './FavoritesListSectionCollapsed';

interface Props {
  collapsableState: SidebarCollapsableState;
  allFavoritesPromise: Promise<FavoriteEntity[]>;
}

export default function FavoriteParentItem({ collapsableState, allFavoritesPromise }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isSidebarCollapsed } = useSideBarState();
  const [isCollapsedMenuOpen, setIsCollapsedMenuOpen] = useState(false);
  const isCollapsed: boolean = !!collapsableState[SIDEBAR_COLLAPSABLE_FAVORITES];
  const allFavorites: FavoriteEntity[] = use(allFavoritesPromise);

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
        await setSidebarCollapsableStateAction(SIDEBAR_COLLAPSABLE_FAVORITES, open);
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
              <Heart />
            </SidebarMenuButtonV1>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            className="max-h-220 w-72 overflow-auto p-2"
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave }
          >
            <FavoritesListSectionCollapsed />
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
            <Heart />
            <span>Favorites</span>
            <FavoriteCount allFavoritesPromise={ allFavoritesPromise } />
            { isPending ?
              <Skeleton className="ml-auto h-4 w-4" />
            : <ChevronRight className={ `
              ml-auto transition-transform duration-200
              group-data-[state=open]/collapsible:rotate-90
            ` } /> }
          </SidebarMenuButtonV1>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            <FavoritesListSection allFavorites={ allFavorites } />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SidebarMenuButtonV1({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<'button'>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1] || ''; // add
  const isActive = firstPath === 'favorites';

  const handleOnMouseEnter = () => {
    revalidateFavoritesAll();
  };

  return (
    <SidebarMenuButton className="cursor-pointer" isActive={ isActive } { ...props } onMouseEnter={ handleOnMouseEnter }>
      { children }
    </SidebarMenuButton>
  );
}

function FavoriteCount({ allFavoritesPromise }: { allFavoritesPromise: Promise<FavoriteEntity[]> }) {
  const allFavorites: FavoriteEntity[] = use(allFavoritesPromise);
  return <span>({ allFavorites.length })</span>;
}
