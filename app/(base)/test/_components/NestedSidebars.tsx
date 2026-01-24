'use client';

import Link from 'next/link';
import { useState } from 'react';
import { File, Folder, FolderOpen, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

type NestedItemProps = {
  item: NestedItem;
  level?: number;
};

function NestedSidebarItem({ item, level = 0 }: NestedItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(level === 0 ? true : level < 2);

  // For top-level items (level 0), use SidebarMenuItem/SidebarMenuButton
  if (level === 0) {
    if (hasChildren) {
      return (
        <Collapsible asChild open={ isOpen } onOpenChange={ setIsOpen }>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                { isOpen ?
                  <FolderOpen className="stroke-primary" />
                : <Folder className="stroke-primary" /> }
                <span>{ item.label }</span>
                <ChevronRight
                  className={ cn(
                    'ml-auto stroke-primary transition-transform duration-200',
                    isOpen && 'rotate-90',
                  ) }
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                { item.children?.map((child) => (
                  <NestedSidebarItem key={ child.id } item={ child } level={ level + 1 } />
                )) }
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={ item.href ?? '#' }>
            <File className="stroke-primary" />
            <span>{ item.label }</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // For nested levels, use SidebarMenuSubItem/SidebarMenuSubButton
  if (hasChildren) {
    return (
      <Collapsible asChild open={ isOpen } onOpenChange={ setIsOpen }>
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton className="cursor-pointer">
              { isOpen ?
                <FolderOpen className="stroke-primary" />
              : <Folder className="stroke-primary" /> }
              <span>{ item.label }</span>
              <ChevronRight
                className={ cn(
                  'ml-auto stroke-primary transition-transform duration-200',
                  isOpen && 'rotate-90',
                ) }
              />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              { item.children?.map((child) => (
                <NestedSidebarItem key={ child.id } item={ child } level={ level + 1 } />
              )) }
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Link href={ item.href ?? '#' }>
          <File className="size-4 stroke-primary" />
          <span>{ item.label }</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export default function NestedSidebars() {
  return (
    <SidebarMenu>
      { mockJsonDataWithNestedLevelDatas.map((item) => (
        <NestedSidebarItem key={ item.id } item={ item } />
      )) }
    </SidebarMenu>
  );
}


type NestedItem = {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NestedItem[];
};

const mockJsonDataWithNestedLevelDatas: NestedItem[] = [
  {
    id: "1",
    label: "Dashboard",
    icon: "dashboard",
    href: "/dashboard",
  },
  {
    id: "2",
    label: "Products",
    icon: "inventory",
    children: [
      {
        id: "2-1",
        label: "All Products",
        href: "/products",
      },
      {
        id: "2-2",
        label: "Categories",
        children: [
          {
            id: "2-2-1",
            label: "Electronics",
            children: [
              {
                id: "2-2-1-1",
                label: "Phones",
                href: "/products/categories/electronics/phones",
              },
              {
                id: "2-2-1-2",
                label: "Laptops",
                href: "/products/categories/electronics/laptops",
              },
              {
                id: "2-2-1-3",
                label: "Tablets",
                href: "/products/categories/electronics/tablets",
              },
            ],
          },
          {
            id: "2-2-2",
            label: "Clothing",
            children: [
              {
                id: "2-2-2-1",
                label: "Men",
                href: "/products/categories/clothing/men",
              },
              {
                id: "2-2-2-2",
                label: "Women",
                href: "/products/categories/clothing/women",
              },
            ],
          },
          {
            id: "2-2-3",
            label: "Home & Garden",
            href: "/products/categories/home-garden",
          },
        ],
      },
      {
        id: "2-3",
        label: "Inventory",
        href: "/products/inventory",
      },
    ],
  },
  {
    id: "3",
    label: "Orders",
    icon: "shopping_cart",
    children: [
      {
        id: "3-1",
        label: "All Orders",
        href: "/orders",
      },
      {
        id: "3-2",
        label: "Order Status",
        children: [
          {
            id: "3-2-1",
            label: "Pending",
            href: "/orders/status/pending",
          },
          {
            id: "3-2-2",
            label: "Processing",
            children: [
              {
                id: "3-2-2-1",
                label: "Payment Verified",
                href: "/orders/status/processing/payment-verified",
              },
              {
                id: "3-2-2-2",
                label: "Packing",
                href: "/orders/status/processing/packing",
              },
              {
                id: "3-2-2-3",
                label: "Ready to Ship",
                href: "/orders/status/processing/ready-to-ship",
              },
            ],
          },
          {
            id: "3-2-3",
            label: "Shipped",
            href: "/orders/status/shipped",
          },
          {
            id: "3-2-4",
            label: "Delivered",
            href: "/orders/status/delivered",
          },
        ],
      },
      {
        id: "3-3",
        label: "Returns",
        children: [
          {
            id: "3-3-1",
            label: "Return Requests",
            href: "/orders/returns/requests",
          },
          {
            id: "3-3-2",
            label: "Refunds",
            children: [
              {
                id: "3-3-2-1",
                label: "Pending Refunds",
                href: "/orders/returns/refunds/pending",
              },
              {
                id: "3-3-2-2",
                label: "Completed Refunds",
                href: "/orders/returns/refunds/completed",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "4",
    label: "Users",
    icon: "people",
    children: [
      {
        id: "4-1",
        label: "All Users",
        href: "/users",
      },
      {
        id: "4-2",
        label: "Roles & Permissions",
        children: [
          {
            id: "4-2-1",
            label: "Admin",
            children: [
              {
                id: "4-2-1-1",
                label: "Super Admin",
                href: "/users/roles/admin/super",
              },
              {
                id: "4-2-1-2",
                label: "Moderator",
                href: "/users/roles/admin/moderator",
              },
            ],
          },
          {
            id: "4-2-2",
            label: "Customer",
            href: "/users/roles/customer",
          },
          {
            id: "4-2-3",
            label: "Vendor",
            href: "/users/roles/vendor",
          },
        ],
      },
    ],
  },
  {
    id: "5",
    label: "Settings",
    icon: "settings",
    children: [
      {
        id: "5-1",
        label: "General",
        href: "/settings/general",
      },
      {
        id: "5-2",
        label: "Security",
        children: [
          {
            id: "5-2-1",
            label: "Authentication",
            children: [
              {
                id: "5-2-1-1",
                label: "Two-Factor Auth",
                href: "/settings/security/auth/2fa",
              },
              {
                id: "5-2-1-2",
                label: "SSO Settings",
                href: "/settings/security/auth/sso",
              },
            ],
          },
          {
            id: "5-2-2",
            label: "Privacy",
            href: "/settings/security/privacy",
          },
        ],
      },
      {
        id: "5-3",
        label: "Notifications",
        href: "/settings/notifications",
      },
    ],
  },
];