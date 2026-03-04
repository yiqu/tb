'use client';

import { Settings } from 'lucide-react';

import Link from '@/shared/components/Link';

import { DropdownMenuItem } from '../ui/dropdown-menu';

export default function ThemeAndMoreSettingsMenuSettingsLink() {
  return (
    <DropdownMenuItem asChild>
      <Link href="/account" className="flex cursor-pointer items-center gap-x-2">
        <Settings className="size-4" />
        Settings
      </Link>
    </DropdownMenuItem>
  );
}
