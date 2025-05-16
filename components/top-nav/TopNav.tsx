import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import ThemeToggleButton from './ThemeToggleButton';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';

export default function TopNav() {
  return (
    <>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className={ `mr-2 data-[orientation=vertical]:h-4` } />
        <Breadcrumbs />
      </div>
      <div className="flex flex-row items-center justify-end gap-x-2 px-4">
        <ThemeToggleButton />
      </div>
    </>
  );
}
