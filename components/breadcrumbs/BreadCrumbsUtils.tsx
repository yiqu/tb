import { Search } from 'lucide-react';
import startCase from 'lodash/startCase';
import { Params } from 'next/dist/server/request/params';

import { cn } from '@/lib/utils';

import Typography from '../typography/Typography';

export function BreadcrumbSegmentIcon({ path, params, isLast }: { path: string; params: Params; isLast?: boolean }) {
  if (path === 'poke') {
    return <Search />;
  }

  return null;
}

export function BreadcrumbSegmentTitle({ path, isLast }: { path: string; isLast?: boolean }) {
  if (path === 'poke') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        Pokemon
      </Typography>
    );
  }

  return (
    <Typography
      className={ cn({
        'text-muted-foreground': isLast,
      }) }
    >
      { startCase(path) }
    </Typography>
  );
}
