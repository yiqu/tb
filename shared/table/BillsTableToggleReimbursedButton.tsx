/* eslint-disable better-tailwindcss/multiline */
import { BanknoteArrowDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function BillsTableToggleReimbursedButton({ isReimbursed }: { isReimbursed: boolean }) {
  return (
    <Button size="icon" variant="ghost">
      <BanknoteArrowDown
        className={ cn(`size-6 text-muted dark:text-gray-500/60`, {
          'text-green-600 dark:text-green-500': isReimbursed,
        }) }
      />
    </Button>
  );
}
