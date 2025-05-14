import startCase from 'lodash/startCase';
import { Search, UserRound } from 'lucide-react';
import { Params } from 'next/dist/server/request/params';

import { cn } from '@/lib/utils';
import CenterUnderline from '@/fancy/components/text/underline-center';

import Typography from '../typography/Typography';

export function BreadcrumbSegmentIcon({ path }: { path: string; params: Params; isLast?: boolean }) {
  if (path === 'search') {
    return <Search size={ 14 } />;
  }
  if (path === 'account') {
    return <UserRound size={ 14 } />;
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

  if (path === 'account') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <CenterUnderline label="User Account" />
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
