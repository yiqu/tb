'use client';

import useBrowserAgent from '@/hooks/useBrowserAgent';
import { useClientOnly } from '@/hooks/useClientOnly';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import ThemeToggleButton from './ThemeToggleButton';
import ThemeToggleAnimatedButton from './ThemeToggleAnimatedButton';

export default function ThemeToggleButtonParent() {
  const isClient = useClientOnly();
  const userAgent = useBrowserAgent();

  if (!isClient) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Skeleton className="h-4 w-4 rounded-full" />
      </Button>
    );
  }

  if (userAgent === 'chrome') {
    return <ThemeToggleAnimatedButton />;
  }

  if (userAgent === 'firefox') {
    return <ThemeToggleButton />;
  }

  return <ThemeToggleButton />;
}
