import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function SearchTableActionBar() {
  return (
    <div className="flex flex-row items-center justify-start">
      <Button variant="outline" size="default" className="bg-card">
        <RefreshCcw />
        Refresh
      </Button>
    </div>
  );
}
