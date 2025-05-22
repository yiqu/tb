import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Searchbar() {
  return (
    <div>
      <Button variant="outline" size="default">
        <RefreshCcw />
        Refresh
      </Button>
    </div>
  );
}
