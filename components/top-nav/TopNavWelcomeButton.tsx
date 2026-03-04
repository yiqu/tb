import { Presentation } from 'lucide-react';

import Link from '@/shared/components/Link';

import { Button } from '../ui/button';

export default function TopNavWelcomeButton() {
  return (
    <Button variant="outline" size="icon" asChild title="Go to welcome page">
      <Link href="/welcome" prefetch={ true }>
        <Presentation />
      </Link>
    </Button>
  );
}
