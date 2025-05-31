/* eslint-disable better-tailwindcss/multiline */
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import TopNavRightActionButtons from './TopNavRightActionButtons';

export default function TopNav() {
  return (
    <>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className={ `mr-2 data-[orientation=vertical]:h-4` } />
        <Breadcrumbs />
      </div>
      <TopNavRightActionButtons />
    </>
  );
}
