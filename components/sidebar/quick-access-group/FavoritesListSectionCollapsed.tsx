import Link from 'next/link';

import { Separator } from '@/components/ui/separator';

export default function FavoritesListSectionCollapsed() {
  return (
    <>
      <div className="mb-2 text-sm font-medium">Add New</div>
      <Separator className="my-1" />
      <div className="space-y-1">
        <Link href={ '/' } className={ `
          flex items-center rounded-md px-2 py-1.5 text-sm
          hover:bg-accent hover:text-accent-foreground
        ` }>
          1
        </Link>
      </div>
    </>
  );
}
