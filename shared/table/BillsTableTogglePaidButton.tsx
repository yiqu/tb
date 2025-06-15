/* eslint-disable better-tailwindcss/multiline */
import { BanknoteArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function BillsTableTogglePaidButton({ isPaid }: { isPaid: boolean }) {
  return (
    <Button size="icon" variant="ghost">
      <BanknoteArrowUp
        className={ cn(`size-6 text-muted dark:text-gray-500/60`, {
          'text-green-600 dark:text-green-500': isPaid,
        }) }
      />
    </Button>
  );
}
