'use client';

import { Settings } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarGroupAction,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
type Props = {
  items: { id: number; name: string }[];
  inViewIds: string[];
};

export default function ContentNavigation({ items, inViewIds }: Props) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation { items.length }</SidebarGroupLabel>
        <SidebarGroupAction
          onClick={ () => {
            console.log('settings');
          } }
        >
          <Settings className="size-4" />
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu className="">
            { items.map((item: { id: number; name: string }, index: number, array: { id: number; name: string }[]) => (
              <NavigationItem key={ item.id } item={ item } index={ index } array={ array } isInView={ inViewIds.includes(`content-${item.id}`) } />
            )) }
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function NavigationItem({
  item,
  index,
  array,
  isInView,
}: {
  item: { id: number; name: string };
  index: number;
  array: { id: number; name: string }[];
  isInView: boolean;
}) {
  const isLastItem = index === array.length - 1;
  return (
    <SidebarMenuItem className="w-full justify-between">
      <SidebarMenuButton asChild>
        <Button
          variant="ghost"
          className={ cn('flex flex-row justify-start gap-x-2', {
            'text-red-500': isLastItem,
            'border border-green-500': isInView,
          }) }
        >
          <Typography>{ index + 1 }</Typography>
          <Typography>{ item.name }</Typography>
          <Typography>{ item.id }</Typography>
          <Badge variant="outline">{ item.name }</Badge>
        </Button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

