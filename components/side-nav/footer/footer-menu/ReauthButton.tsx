'use client';

import { RotateCcw } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { removeIsAdminPasswordCorrect } from '@/server/admin/admin.server';

export default function ReauthButton() {
  const handleReauth = () => {
    removeIsAdminPasswordCorrect();
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={ handleReauth }>
      <RotateCcw />
      Reauthenticate
    </DropdownMenuItem>
  );
}
