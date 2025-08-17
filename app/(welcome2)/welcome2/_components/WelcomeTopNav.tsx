import Link from 'next/link';

import { geistFont } from '@/lib/fonts-config';
import Typography from '@/components/typography/Typography';
import ThemeToggleAnimatedButton from '@/components/top-nav/ThemeToggleAnimatedButton';

import ResourcesDropdownMenuButton from './ResourcesDropdownMenuButton';

export default function WelcomeTopNav() {
  return (
    <div className="sticky top-8 z-50 flex h-0 w-full flex-row items-center justify-between bg-transparent px-50">
      <div className={ `
        ${geistFont.className}
      ` }>
        <Link href="/welcome2">
          <Typography className="font-bold tracking-wider">KQPRO</Typography>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-end gap-x-2">
        <ResourcesDropdownMenuButton variant="ghost" />
        <ThemeToggleAnimatedButton variant="ghost" />
      </div>
    </div>
  );
}
