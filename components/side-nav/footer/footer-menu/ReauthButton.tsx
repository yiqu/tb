'use client';

import { RotateCcw } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function ReauthButton() {
  const handleReauth = async () => {};

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={ handleReauth }>
      <RotateCcw />
      Reauthenticate
    </DropdownMenuItem>
  );
}
