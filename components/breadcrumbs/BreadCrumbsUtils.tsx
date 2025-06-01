import startCase from 'lodash/startCase';
import { Params } from 'next/dist/server/request/params';
import { Link, Brush, Search, Shield, Settings, Calendar, UserRound, CirclePlus, UserRoundPen, CalendarSync } from 'lucide-react';

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
  if (path === 'add') {
    return <CirclePlus size={ 14 } />;
  }
  if (path === 'subscription') {
    return <CalendarSync size={ 14 } />;
  }
  if (path === 'bill') {
    return <Calendar size={ 14 } />;
  }
  if (path === 'security') {
    return <Shield size={ 14 } />;
  }
  return <Link size={ 14 } />;
}

export function BreadcrumbSegmentTitle({ path, isLast }: { path: string; isLast?: boolean }) {
  if (path === 'account') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'General Settings' } />
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
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Personal Info' } />
      </Typography>
    );
  }

  if (path === 'bill') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Bill' } />
      </Typography>
    );
  }

  if (path === 'add') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Add' } />
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

export function BreadcrumbSegmentDisplay({ isLast, path }: { isLast?: boolean; path: string }) {
  if (isLast) {
    return <>{ path }</>;
  }

  return <CenterUnderline label={ path } />;
}
