/* eslint-disable better-tailwindcss/multiline */

'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        { items.map((item) => (
          <Collapsible key={ item.title } asChild defaultOpen={ item.isActive } className={ `group/collapsible` }>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={ item.title }>
                  { item.icon ?
                    <item.icon />
                  : null }
                  <span>{ item.title }</span>
                  <ChevronRight className={ `
                    ml-auto transition-transform duration-200
                    group-data-[state=open]/collapsible:rotate-90
                  ` } />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  { item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={ subItem.title }>
                      <SidebarMenuSubButton asChild>
                        <a href={ subItem.url }>
                          <span>{ subItem.title }</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )) }
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )) }
      </SidebarMenu>
    </SidebarGroup>
  );
}
