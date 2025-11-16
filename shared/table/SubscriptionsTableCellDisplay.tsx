/* eslint-disable prefer-destructuring */

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import startCase from 'lodash/startCase';
import { ExternalLinkIcon } from 'lucide-react';

import { TableCell } from '@/components/ui/table';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import CenterUnderline from '@/fancy/components/text/underline-center';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableAddDueBillButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableAddDueBillButton';
import SubscriptionsTableEditFavoriteButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableEditFavoriteButton';
import SubscriptionsTableEditSubscriptionButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableEditSubscriptionButton';
import SubscriptionsTableDeleteSubscriptionButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableDeleteSubscriptionButton';

import DateDialogContent from '../dialogs/DateDialog';
import DateRelativeDisplay from './DateRelativeDisplay';
import { getFrequencyImageUrl, getSubscriptionLogoSize } from './table.utils';
import SubscriptionsTableToggleSignedButton from './SubscriptionsTableToggleSignedButton';
import SubscriptionsTableToggleApprovedButton from './SubscriptionsTableToggleApprovedButton';
import SubscriptionsTableCellDisplayCurrentYearCount from './SubscriptionsTableCellDisplayCurrentYearCount';

const useFormatter = getUSDFormatter(2, 2);

export default function SubscriptionsTableCellDisplay({ colId, subscription }: { colId: string; subscription: SubscriptionWithBillDues }) {
  if (colId === 'cost') {
    let { cost } = subscription;

    if (cost === null || cost === undefined) {
      cost = subscription.cost;
    }

    return (
      <TableCell>
        <div className={ `
          flex flex-row items-center justify-start gap-x-1
          sec:gap-x-1
          two:gap-x-6
        ` }>
          <Typography className="truncate tabular-nums">{ useFormatter.format(cost) }</Typography>
        </div>
      </TableCell>
    );
  }

  if (colId === 'id') {
    return (
      <TableCell>
        <Typography className="truncate" title={ subscription.id }>
          { subscription.id }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'description') {
    return (
      <TableCell>
        <Typography
          className="text-wrap wrap-break-word"
          title={ subscription.description ?? 'N/A' }
          variant={ subscription.description ? 'labelvalue1' : 'nodata1' }
        >
          { subscription.description ? subscription.description : 'N/A' }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'url') {
    if (!subscription.url) {
      return (
        <TableCell>
          <Typography className="truncate" variant="nodata1">
            N/A
          </Typography>
        </TableCell>
      );
    }

    // wrap text to next line if it is too long
    return (
      <TableCell>
        <Link href={ (subscription.url ?? '') as any } target="_blank" rel="noopener noreferrer">
          <div className="flex flex-row items-start justify-start gap-x-1 text-wrap">
            <Typography className="break-all" title={ subscription.url ?? 'N/A' }>
              { subscription.url }
            </Typography>
            <ExternalLinkIcon className="mt-0.5 h-4 w-4 shrink-0" />
          </div>
        </Link>
      </TableCell>
    );
  }

  if (colId === 'billCycleDuration') {
    const freq: string = subscription.billCycleDuration;
    return (
      <TableCell>
        <div className={ `
          flex flex-row items-center justify-start gap-x-1
          sec:gap-x-1
          two:gap-x-2
        ` }>
          <Image
            src={ getFrequencyImageUrl(subscription.billCycleDuration) }
            alt="Frequency"
            width={ 22 }
            height={ 22 }
            className={ `opacity-90` }
          />

          <Typography className="truncate">{ startCase(freq) }</Typography>
        </div>
      </TableCell>
    );
  }

  if (colId === 'dateAdded') {
    return (
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${subscription.dateAdded}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-accent
              ` }
            >
              <Typography className="truncate">{ subscription.dateAddedInEst }</Typography>
              <DateRelativeDisplay
                time={ subscription.dateAdded as any }
                largest={ 2 }
                updateInterval={ 60_000 }
                useShortText={ true }
                overrideHideSeconds={ true }
              />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Suspense>
              <DateDialogContent dateTime={ subscription.dateAdded } />
            </Suspense>
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'approved') {
    const isApproved = !!subscription.approved;
    return (
      <TableCell>
        <SubscriptionsTableToggleApprovedButton isApproved={ isApproved } subscriptionId={ subscription.id } />
      </TableCell>
    );
  }

  if (colId === 'signed') {
    const isSigned = !!subscription.signed;
    return (
      <TableCell>
        <SubscriptionsTableToggleSignedButton isSigned={ isSigned } subscriptionId={ subscription.id } />
      </TableCell>
    );
  }

  if (colId === 'name') {
    const subName = subscription.name;
    const isFavorited: boolean = (subscription.favorites ?? []).length > 0;

    return (
      <TableCell>
        <div className="flex h-full flex-row items-center justify-between gap-x-2">
          <Link href={ `/subscriptions/${subscription.id}` } prefetch={ true }>
            <div className="flex flex-row items-center justify-start gap-x-2 text-wrap">
              <SubscriptionLogo subscriptionName={ subName } height={ getSubscriptionLogoSize(subName) } />
              <CenterUnderline label={ subName } className="wrap-break-word" />
            </div>
          </Link>
          <div>
            { isFavorited ?
              <SubscriptionsTableEditFavoriteButton subscription={ subscription } />
            : null }
          </div>
        </div>
      </TableCell>
    );
  }

  if (colId === 'billDuesCurrentYearCount') {
    return (
      <TableCell>
        <SubscriptionsTableCellDisplayCurrentYearCount subscription={ subscription } />
      </TableCell>
    );
  }

  if (colId === 'billDuesCurrentYearTotalCost') {
    return (
      <TableCell>
        <Typography
          className="truncate"
          variant={ subscription.billDuesCurrentYearTotalCost ? 'labelvalue1' : 'nodata1' }
          title={ `Outstanding cost this year: ${subscription.billDuesCurrentYearTotalCost}` }
        >
          { useFormatter.format(subscription.billDuesCurrentYearTotalCost ?? 0) }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'totalBillsAllTimeCount') {
    return (
      <TableCell>
        <Typography
          className="truncate"
          variant={ subscription.totalBillsAllTimeCount ? 'labelvalue1' : 'nodata1' }
          title={ `Total bills all time: ${subscription.totalBillsAllTimeCount}` }
        >
          { subscription.totalBillsAllTimeCount === undefined ? 'N/A' : subscription.totalBillsAllTimeCount.toLocaleString() }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'totalBillsAllTimeTotalCost') {
    return (
      <TableCell>
        <Typography
          className="truncate"
          variant={ subscription.totalBillsAllTimeTotalCost ? 'labelvalue1' : 'nodata1' }
          title={ `Total bills all time: ${subscription.totalBillsAllTimeTotalCost}` }
        >
          { subscription.totalBillsAllTimeTotalCost === undefined ? 'N/A' : useFormatter.format(subscription.totalBillsAllTimeTotalCost) }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${subscription.updatedAt}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-accent
              ` }
            >
              { `${subscription.updatedAt}` === `${subscription.dateAdded}` ?
                <Typography variant="nodata1">N/A</Typography>
              : <>
                <Typography className="truncate">{ subscription.updatedAtInEst }</Typography>
                <DateRelativeDisplay
                    time={ subscription.updatedAt as any }
                    largest={ 2 }
                    updateInterval={ 60_000 }
                    useShortText={ true }
                    overrideHideSeconds={ true }
                  />
              </>
              }
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Suspense>
              <DateDialogContent dateTime={ subscription.updatedAt } />
            </Suspense>
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'actions') {
    return (
      <TableCell className="">
        <div className="flex w-full flex-row items-center justify-start gap-x-1">
          <SubscriptionsTableAddDueBillButton subscription={ subscription } />
          <SubscriptionsTableEditSubscriptionButton subscription={ subscription } />
          <SubscriptionsTableDeleteSubscriptionButton subscription={ subscription } />
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <span>N/A</span>
    </TableCell>
  );
}
