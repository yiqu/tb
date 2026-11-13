import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import {
  SubscriptionDetailsStats,
  SubscriptionDetailsStatsBill,
  SubscriptionDetailsStatsPeriod,
  SubscriptionDetailsStatsYearNode,
  SubscriptionDetailsStatsRunningTotalNode,
  SubscriptionDetailsStatsStatusBreakdown,
} from '@/models/subscriptions/subscription-details-stats.model';

function getPeriod(bills: SubscriptionDetailsStatsBill[]): SubscriptionDetailsStatsPeriod {
  let cost = 0;
  let completedCount = 0;
  for (const bill of bills) {
    cost += bill.cost;
    if (bill.paid && bill.reimbursed) {
      completedCount += 1;
    }
  }
  return { count: bills.length, cost, completedCount };
}

/**
 * Derives every number and chart series on the subscription details page from the subscription's
 * bills, which the page has already fetched, so no extra query is needed.
 *
 * "Today" is the calendar day in the EST time zone. A bill due today counts as spent, not upcoming.
 */
export function getSubscriptionDetailsStats(bills: SubscriptionDetailsStatsBill[], nowMillis: number): SubscriptionDetailsStats {
  const now = DateTime.fromMillis(nowMillis, { zone: EST_TIME_ZONE });
  const endOfToday: number = now.endOf('day').toMillis();
  const monthStart: number = now.startOf('month').toMillis();
  const monthEnd: number = now.endOf('month').toMillis();
  const yearStart: number = now.startOf('year').toMillis();
  const yearEnd: number = now.endOf('year').toMillis();

  const sorted: SubscriptionDetailsStatsBill[] = bills.toSorted((a, b) => a.dueDate - b.dueDate);
  const pastBills: SubscriptionDetailsStatsBill[] = sorted.filter((bill) => bill.dueDate <= endOfToday);
  const futureBills: SubscriptionDetailsStatsBill[] = sorted.filter((bill) => bill.dueDate > endOfToday);

  // per year, with empty years in between filled in so the chart's time axis has no holes
  const yearNodes = new Map<number, SubscriptionDetailsStatsYearNode>();
  const statusBreakdown: SubscriptionDetailsStatsStatusBreakdown = { completed: 0, paidNotReimbursed: 0, notPaid: 0, upcoming: 0 };
  const runningTotal: SubscriptionDetailsStatsRunningTotalNode[] = [];
  let total = 0;

  sorted.forEach((bill, index) => {
    const isFuture: boolean = bill.dueDate > endOfToday;
    const { year } = DateTime.fromMillis(bill.dueDate, { zone: EST_TIME_ZONE });
    const node: SubscriptionDetailsStatsYearNode = yearNodes.get(year) ?? { year, spent: 0, upcoming: 0, total: 0, count: 0 };
    node.count += 1;
    node.total += bill.cost;
    if (isFuture) {
      node.upcoming += bill.cost;
    } else {
      node.spent += bill.cost;
    }
    yearNodes.set(year, node);

    if (bill.paid && bill.reimbursed) {
      statusBreakdown.completed += 1;
    } else if (isFuture) {
      statusBreakdown.upcoming += 1;
    } else if (bill.paid) {
      statusBreakdown.paidNotReimbursed += 1;
    } else {
      statusBreakdown.notPaid += 1;
    }

    total += bill.cost;
    const isLastPastBill: boolean = !isFuture && index === pastBills.length - 1 && futureBills.length > 0;
    runningTotal.push({
      dueDate: bill.dueDate,
      spent: isFuture ? null : total,
      upcoming: isFuture || isLastPastBill ? total : null,
    });
  });

  const perYear: SubscriptionDetailsStatsYearNode[] = [];
  if (sorted.length > 0) {
    const firstYear: number = DateTime.fromMillis(sorted[0].dueDate, { zone: EST_TIME_ZONE }).year;
    const lastYear: number = Math.max(DateTime.fromMillis(sorted[sorted.length - 1].dueDate, { zone: EST_TIME_ZONE }).year, now.year);
    for (let year = firstYear; year <= lastYear; year++) {
      perYear.push(yearNodes.get(year) ?? { year, spent: 0, upcoming: 0, total: 0, count: 0 });
    }
  }

  return {
    currentYear: now.year,
    currentMonthLabel: now.toFormat('LLL yyyy'),
    thisMonth: getPeriod(sorted.filter((bill) => bill.dueDate >= monthStart && bill.dueDate <= monthEnd)),
    thisYear: getPeriod(sorted.filter((bill) => bill.dueDate >= yearStart && bill.dueDate <= yearEnd)),
    allTime: getPeriod(sorted),
    spentToDate: getPeriod(pastBills),
    upcoming: getPeriod(futureBills),
    firstDueDate: sorted.length > 0 ? sorted[0].dueDate : null,
    lastDueDate: sorted.length > 0 ? sorted[sorted.length - 1].dueDate : null,
    nextDueDate: futureBills.length > 0 ? futureBills[0].dueDate : null,
    perYear,
    runningTotal,
    statusBreakdown,
  };
}

export function formatStatsDate(millis: number, format: string = 'LLL d, yyyy'): string {
  return DateTime.fromMillis(millis, { zone: EST_TIME_ZONE }).toFormat(format);
}

const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCompactUsd(value: number): string {
  return compactUsdFormatter.format(value);
}
