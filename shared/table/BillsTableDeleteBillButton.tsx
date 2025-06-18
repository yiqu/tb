import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function BillsTableDeleteBillButton() {
  return (
    <Button variant="ghost" size="icon" className="size-6">
      <Trash />
    </Button>
  );
}
