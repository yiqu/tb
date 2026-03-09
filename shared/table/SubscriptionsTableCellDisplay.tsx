/* eslint-disable prefer-destructuring */

import Image from 'next/image';
import { Suspense } from 'react';
import startCase from 'lodash/startCase';
import { ExternalLinkIcon } from 'lucide-react';

import Link from '@/shared/components/Link';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableAddDueBillButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableAddDueBillButton';
import SubscriptionsTableEditFavoriteButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableEditFavoriteButton';
import SubscriptionsTableEditSubscriptionButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableEditSubscriptionButton';
import SubscriptionsTableDeleteSubscriptionButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableDeleteSubscriptionButton';
import SubscriptionDetailsDialogOpenButton from '@/app/(base)/subscriptions/[subscriptionId]/_components/SubscriptionDetailsDialogOpenButton';

import RowStack from '../components/RowStack';
import DateDialogContent from '../dialogs/DateDialog';
import FormattedTableCell from './FormattedTableCell';
import DateRelativeDisplay from './DateRelativeDisplay';
import { getFrequencyImageUrl, getSubscriptionLogoSize } from './table.utils';
import SubscriptionsTableToggleSignedButton from './SubscriptionsTableToggleSignedButton';
import SubscriptionsTableToggleApprovedButton from './SubscriptionsTableToggleApprovedButton';
import SubscriptionsTableCellDisplayCurrentYearCount from './SubscriptionsTableCellDisplayCurrentYearCount';

const useFormatter = getUSDFormatter(2, 2);

export default function SubscriptionsTableCellDisplay({
  colId,
  subscription,
  showVerticalBorder,
  isSticky,
}: {
  colId: string;
  subscription: SubscriptionWithBillDues;
  showVerticalBorder?: boolean;
  isSticky?: boolean;
}) {
  if (colId === 'cost') {
    let { cost } = subscription;

    if (cost === null || cost === undefined) {
      cost = subscription.cost;
    }

    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <div className={ `flex flex-row items-center justify-start gap-x-1` }>
          <Typography className="truncate tabular-nums">{ useFormatter.format(cost) }</Typography>
        </div>
      </FormattedTableCell>
    );
  }

  if (colId === 'id') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Typography className="truncate" title={ subscription.id }>
          { subscription.id }
        </Typography>
      </FormattedTableCell>
    );
  }

  if (colId === 'description') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Typography className="text-wrap wrap-break-word" variant={ subscription.description ? 'labelvalue1' : 'nodata1' }>
          { subscription.description ? subscription.description : 'N/A' }
        </Typography>
      </FormattedTableCell>
    );
  }

  if (colId === 'url') {
    if (!subscription.url) {
      return (
        <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
          <Typography className="truncate" variant="nodata1">
            N/A
          </Typography>
        </FormattedTableCell>
      );
    }

    // wrap text to next line if it is too long
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Link href={ (subscription.url ?? '') as any } target="_blank" rel="noopener noreferrer">
          <div className="flex flex-row items-start justify-start gap-x-1 text-wrap">
            <Typography className="break-all" title={ subscription.url ?? 'N/A' }>
              { subscription.url }
            </Typography>
            <ExternalLinkIcon className="mt-0.5 h-4 w-4 shrink-0" />
          </div>
        </Link>
      </FormattedTableCell>
    );
  }

  if (colId === 'billCycleDuration') {
    const freq: string = subscription.billCycleDuration;
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
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
      </FormattedTableCell>
    );
  }

  if (colId === 'dateAdded') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${subscription.dateAdded}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-background
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
      </FormattedTableCell>
    );
  }

  if (colId === 'approved') {
    const isApproved = !!subscription.approved;
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <SubscriptionsTableToggleApprovedButton isApproved={ isApproved } subscriptionId={ subscription.id } />
      </FormattedTableCell>
    );
  }

  if (colId === 'signed') {
    const isSigned = !!subscription.signed;
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <SubscriptionsTableToggleSignedButton isSigned={ isSigned } subscriptionId={ subscription.id } />
      </FormattedTableCell>
    );
  }

  if (colId === 'name') {
    const subName = subscription.name;
    const isFavorited: boolean = (subscription.favorites ?? []).length > 0;

    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <RowStack className="h-full items-center justify-between gap-x-2">
          <Link href={ `/subscriptions/${subscription.id}` } prefetch={ true }>
            <RowStack className="items-center justify-start gap-x-2 text-wrap">
              <SubscriptionLogo subscriptionName={ subName } height={ getSubscriptionLogoSize(subName) } />
              <Typography className="wrap-break-word">{ subName }</Typography>
              <div>
                { isFavorited ?
                  <SubscriptionsTableEditFavoriteButton subscription={ subscription } />
                : null }
              </div>
            </RowStack>
          </Link>
          <SubscriptionDetailsDialogOpenButton subscriptionId={ subscription.id } />
        </RowStack>
      </FormattedTableCell>
    );
  }

  if (colId === 'billDuesCurrentYearCount') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <SubscriptionsTableCellDisplayCurrentYearCount subscription={ subscription } />
      </FormattedTableCell>
    );
  }

  if (colId === 'billDuesCurrentYearTotalCost') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Typography
          className="truncate"
          variant={ subscription.billDuesCurrentYearTotalCost ? 'labelvalue1' : 'nodata1' }
          title={ `Outstanding cost this year: ${subscription.billDuesCurrentYearTotalCost}` }
        >
          { useFormatter.format(subscription.billDuesCurrentYearTotalCost ?? 0) }
        </Typography>
      </FormattedTableCell>
    );
  }

  if (colId === 'totalBillsAllTimeCount') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Typography
          className="truncate"
          variant={ subscription.totalBillsAllTimeCount ? 'labelvalue1' : 'nodata1' }
          title={ `Total bills all time: ${subscription.totalBillsAllTimeCount}` }
        >
          { subscription.totalBillsAllTimeCount === undefined ? 'N/A' : subscription.totalBillsAllTimeCount.toLocaleString() }
        </Typography>
      </FormattedTableCell>
    );
  }

  if (colId === 'totalBillsAllTimeTotalCost') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Typography
          className="truncate"
          variant={ subscription.totalBillsAllTimeTotalCost ? 'labelvalue1' : 'nodata1' }
          title={ `Total bills all time: ${subscription.totalBillsAllTimeTotalCost}` }
        >
          { subscription.totalBillsAllTimeTotalCost === undefined ? 'N/A' : useFormatter.format(subscription.totalBillsAllTimeTotalCost) }
        </Typography>
      </FormattedTableCell>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${subscription.updatedAt}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-background
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
      </FormattedTableCell>
    );
  }

  if (colId === 'tableActions') {
    return (
      <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
        <div className="flex w-full flex-row items-center justify-start gap-x-1">
          <SubscriptionsTableAddDueBillButton subscription={ subscription } />
          <SubscriptionsTableEditSubscriptionButton subscription={ subscription } />
          <SubscriptionsTableDeleteSubscriptionButton subscription={ subscription } />
        </div>
      </FormattedTableCell>
    );
  }

  return (
    <FormattedTableCell isSticky={ isSticky } showVerticalBorder={ showVerticalBorder }>
      <span>N/A</span>
    </FormattedTableCell>
  );
}
