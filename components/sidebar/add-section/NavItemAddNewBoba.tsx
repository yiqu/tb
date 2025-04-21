/* eslint-disable readable-tailwind/multiline */
'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Folder, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LinkItem, LeftNavItem } from '@/models/NavItem.models';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

import MenuButton from '../MenuButton';
import CollapsedMenuButton from '../CollapsedMenuButton';

const BOBA_TEA_CATEGORIES: LinkItem[] = [
  {
    name: 'Milk Tea',
    url: '/new?category=milk-tea',
  },
  {
    name: 'Fruit Tea',
    url: '/new?category=fruit-tea',
  },
  {
    name: 'Herbal Tea',
    url: '/new?category=herbal-tea',
  },
];

const NEW_ITEM: LeftNavItem = {
  name: 'New Boba',
  url: 'new',
  tooltip: 'New Boba',
};
export default function NavItemAddNewBoba() {
  const { isMobile } = useSidebar();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setOpen(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMenuOpen) {
      setIsHovered(false);
    }

    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100); // Small delay to prevent flickering
  };

  const handleOnMenuOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
  };

  // If collapsed and has items, use Popover for hover menu
  if (isCollapsed) {
    return (
      <SidebarMenu className="gap-2">
        <SidebarMenuItem>
          <Popover open={ open } onOpenChange={ setOpen }>
            <PopoverTrigger asChild>
              <CollapsedMenuButton item={ NEW_ITEM } onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave } />
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              className="w-48 p-2"
              onMouseEnter={ handleMouseEnter }
              onMouseLeave={ handleMouseLeave }
            >
              <div className="mb-2 text-sm font-medium"> New Boba Tea</div>
              <div className="space-y-1">
                { BOBA_TEA_CATEGORIES.map((subItem: LinkItem) => (
                  <a
                    key={ subItem.name }
                    href={ subItem.url }
                    className={ `flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground` }
                  >
                    { subItem.name }
                  </a>
                )) }
              </div>
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarGroupLabel>Add</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave }>
          <MenuButton item={ NEW_ITEM } />
          <DropdownMenu onOpenChange={ handleOnMenuOpenChange }>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction className="cursor-pointer">
                <MoreHorizontal
                  className={ cn('h-4 w-4', {
                    hidden: !isMobile && !isHovered,
                  }) }
                />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              { BOBA_TEA_CATEGORIES.map((item) => {
                return (
                  <DropdownMenuItem asChild key={ item.name } className="cursor-pointer">
                    <Link href={ item.url }>
                      <Folder className="mr-2 h-4 w-4" />
                      <span>{ item.name }</span>
                    </Link>
                  </DropdownMenuItem>
                );
              }) }
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
