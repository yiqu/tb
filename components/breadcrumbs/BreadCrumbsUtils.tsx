import startCase from 'lodash/startCase';
import { Params } from 'next/dist/server/request/params';
import { Brush, Search, Settings, UserRound, UserRoundPen } from 'lucide-react';

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
  if (path === 'personal-info') {
    return <UserRoundPen size={ 14 } />;
  }
  if (path === 'settings') {
    return <Settings size={ 14 } />;
  }
  if (path === 'art') {
    return <Brush size={ 14 } />;
  }

  return null;
}

export function BreadcrumbSegmentTitle({ path, isLast }: { path: string; isLast?: boolean }) {
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

  if (path === 'personal-info') {
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
