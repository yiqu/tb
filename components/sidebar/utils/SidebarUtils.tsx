import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Plus, Search, History, CircleDot, FolderHeart } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SidebarMenuItem } from '@/components/ui/sidebar';

export function getSideBarLucideIcon(url: string) {
  switch (url) {
    case 'new':
      return <Plus />;
    case 'search':
      return <Search />;
    case 'favorites':
      return <FolderHeart />;
    case 'history':
      return <History />;
    default:
      return null;
  }
}

export function SideBarLucideIcon({ url }: { url: string }): ReactNode {
  if (url === 'new') {
    return <Plus />;
  } else if (url === 'search') {
    return <Search />;
  } else if (url === 'favorites') {
    return <FolderHeart />;
  } else if (url === 'history') {
    return <History />;
  }
  return <CircleDot />;
}

export function SearchDateLabel({ children }: { children: ReactNode }) {
  return <div className="mb-1 px-1.5 text-start text-sm text-muted-foreground">{ children }</div>;
}

export function SearchedList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={ cn('flex flex-col gap-y-1', className) }>{ children }</div>;
}

// export function SideNavBarCollapsedMenuItem({
//   children,
//   item,
//   ...props
// }: { children: ReactNode; item: any } & React.ComponentProps<'button'>) {
//   const pathName = usePathname();
//   const firstPath = pathName.split('/')[1] || '';
//   const isActive = firstPath.toLowerCase() === item.url.toLowerCase();

//   return (
//     <SidebarMenuItem className="cursor-pointer" isActive={ isActive } { ...props }>
//       { children }
//     </SidebarMenuItem>
//   );
// }
