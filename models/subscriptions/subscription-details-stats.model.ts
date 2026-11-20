/** The only bill fields the subscription details stats need. Kept slim so little is sent to the client. */
export interface SubscriptionDetailsStatsBill {
  /** Due date in epoch milliseconds. */
  dueDate: number;
  cost: number;
  paid: boolean;
  reimbursed: boolean;
}

export interface SubscriptionDetailsStatsPeriod {
  count: number;
  cost: number;
  /** Bills that are both paid and reimbursed. */
  completedCount: number;
}

export interface SubscriptionDetailsStatsYearNode {
  year: number;
  /** Cost of bills due up to and including today. */
  spent: number;
  /** Cost of bills due after today. */
  upcoming: number;
  total: number;
  count: number;
}

export interface SubscriptionDetailsStatsRunningTotalNode {
  dueDate: number;
  /** Running total up to today. Null for future bills. */
  spent: number | null;
  /** Running total continued into the future. Null for past bills, except the last one so the lines join. */
  upcoming: number | null;
}

/** Each bill counts in exactly one bucket. `upcoming` here is a future bill that is not paid. */
export interface SubscriptionDetailsStatsStatusBreakdown {
  completed: number;
  paidNotReimbursed: number;
  notPaid: number;
  upcoming: number;
}

export interface SubscriptionDetailsStats {
  currentYear: number;
  currentMonthLabel: string;
  thisMonth: SubscriptionDetailsStatsPeriod;
  thisYear: SubscriptionDetailsStatsPeriod;
  allTime: SubscriptionDetailsStatsPeriod;
  /** Bills due from the first bill up to and including today. */
  spentToDate: SubscriptionDetailsStatsPeriod;
  /** Bills due after today. */
  upcoming: SubscriptionDetailsStatsPeriod;
  firstDueDate: number | null;
  lastDueDate: number | null;
  nextDueDate: number | null;
  perYear: SubscriptionDetailsStatsYearNode[];
  runningTotal: SubscriptionDetailsStatsRunningTotalNode[];
  statusBreakdown: SubscriptionDetailsStatsStatusBreakdown;
}
