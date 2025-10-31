import { Params } from 'next/dist/server/request/params';
import {
  Link,
  Brush,
  Search,
  Shield,
  Settings,
  Calendar,
  UserRound,
  CirclePlus,
  ClockAlert,
  ReceiptText,
  UserRoundPen,
  CalendarSync,
  CalendarArrowUp,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import CenterUnderline from '@/fancy/components/text/underline-center';

import Typography from '../typography/Typography';
import BreadCrumbsEntityLeaf from './BreadCrumbsEntityLeaf';

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
  if (path === 'bills') {
    return <Calendar size={ 14 } />;
  }
  if (path === 'bill') {
    return <Calendar size={ 14 } />;
  }
  if (path === 'subscriptions') {
    return <ReceiptText size={ 14 } />;
  }
  if (path === 'security') {
    return <Shield size={ 14 } />;
  }
  if (path === 'outstanding') {
    return <ClockAlert size={ 14 } />;
  }
  if (path === 'upcoming') {
    return <CalendarArrowUp size={ 14 } />;
  }
  return <Link size={ 14 } />;
}

export function BreadcrumbSegmentTitle({ path, isLast, paths }: { path: string; isLast?: boolean; paths: string[] }) {
  if (paths.includes('add')) {
    if (path === 'subscription') {
      return (
        <Typography
          className={ cn({
            'text-muted-foreground': isLast,
          }) }
        >
          <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'New Subscription' } />
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
          <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'New Bill' } />
        </Typography>
      );
    }
  }

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

  if (path === 'subscriptions') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Subscriptions' } />
      </Typography>
    );
  }

  if (path === 'bills') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Bills' } />
      </Typography>
    );
  }

  if (path === 'outstanding') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Outstanding Bills' } />
      </Typography>
    );
  }

  if (path === 'upcoming') {
    return (
      <Typography
        className={ cn({
          'text-muted-foreground': isLast,
        }) }
      >
        <BreadcrumbSegmentDisplay isLast={ isLast } path={ 'Upcoming Bills' } />
      </Typography>
    );
  }

  return <BreadCrumbsEntityLeaf paths={ paths } path={ path } isLast={ isLast } />;
}

export function BreadcrumbSegmentDisplay({ isLast, path }: { isLast?: boolean; path: string }) {
  if (isLast) {
    return <>{ path }</>;
  }

  return <CenterUnderline label={ path } />;
}
