/* eslint-disable no-console */
/**
 * Seeds a LOCAL MongoDB with fake data for every model in schema.prisma.
 *
 * Usage:
 *   npm run seed                 -> default volume (30 subscriptions)
 *   npm run seed -- --scale=20   -> 20x the volume (for testing query plans / indexes)
 *
 * Safety: this script WIPES the target database first. It refuses to run unless
 * DATABASE_URL points at localhost / 127.0.0.1 (pass --force to override).
 *
 * Names, costs and paid / reimbursed flags come from a seeded PRNG, so they are the same on every run.
 * Dates are relative to today (bills from two years ago until 8 months ahead), so the app always has
 * current, past and upcoming bills to show.
 */
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';

const EST_TIME_ZONE = 'America/New_York';

const FREQUENCIES = {
  monthly: 'monthly',
  yearly: 'yearly',
  once: 'once',
} as const;

type Frequency = (typeof FREQUENCIES)[keyof typeof FREQUENCIES];

interface SeedSubscription {
  name: string;
  cost: number;
  frequency: Frequency;
}

const BASE_SUBSCRIPTIONS: SeedSubscription[] = [
  { name: 'ChatGPT Plus', cost: 20, frequency: 'monthly' },
  { name: 'Cursor IDE Pro', cost: 20, frequency: 'monthly' },
  { name: 'GitHub Copilot', cost: 10, frequency: 'monthly' },
  { name: 'GitHub Pro', cost: 4, frequency: 'monthly' },
  { name: 'Vercel Pro', cost: 20, frequency: 'monthly' },
  { name: 'Vercel v0', cost: 20, frequency: 'monthly' },
  { name: 'MongoDB Atlas Flex', cost: 8.5, frequency: 'monthly' },
  { name: 'Medium', cost: 5, frequency: 'monthly' },
  { name: 'T3 Chat', cost: 8, frequency: 'monthly' },
  { name: 'Netflix', cost: 15.49, frequency: 'monthly' },
  { name: 'YouTube TV Base', cost: 72.99, frequency: 'monthly' },
  { name: 'Disney+', cost: 13.99, frequency: 'monthly' },
  { name: 'Paramount+', cost: 11.99, frequency: 'monthly' },
  { name: 'Peacock TV', cost: 7.99, frequency: 'monthly' },
  { name: 'HBO Max', cost: 16.99, frequency: 'monthly' },
  { name: 'Apple TV', cost: 9.99, frequency: 'monthly' },
  { name: 'DAZN', cost: 24.99, frequency: 'monthly' },
  { name: 'Amazon Prime Videos', cost: 139, frequency: 'yearly' },
  { name: 'Microsoft 365', cost: 99.99, frequency: 'yearly' },
  { name: 'MUI X Pro License', cost: 180, frequency: 'yearly' },
  { name: 'Flaticon Pro', cost: 89.99, frequency: 'yearly' },
  { name: 'UI dot dev', cost: 199, frequency: 'yearly' },
  { name: 'Loading io', cost: 49, frequency: 'yearly' },
  { name: 'ByteGrad', cost: 249, frequency: 'yearly' },
  { name: 'Education to Training Hours', cost: 60, frequency: 'yearly' },
  { name: 'CompTIA Security Plus', cost: 392, frequency: 'once' },
  { name: 'MUI Minimal Dashboard', cost: 69, frequency: 'once' },
  { name: 'MonaLisa Typeface', cost: 150, frequency: 'once' },
  { name: 'Pro Nextjs By Jack Harrington', cost: 349, frequency: 'once' },
  { name: 'Unused Trial Service', cost: 0, frequency: 'monthly' }, // intentionally has no bills
];

const HISTORY_PAGES: [string, string][] = [
  ['Dashboard', '/'],
  ['Subscriptions', '/subscriptions'],
  ['Bills', '/bills'],
  ['Outstanding', '/outstanding'],
  ['Upcoming', '/upcoming'],
  ['Search', '/search'],
  ['Favorites', '/favorites'],
  ['History', '/history'],
  ['Account', '/account'],
];

const PAGE_IDS: string[] = [
  'dashboard-current-month',
  'search',
  'subscriptions',
  'outstanding',
  'upcoming',
  'add-new-bill-due-recently-added',
  'subscription-details-bills-bills-table',
];

/** mulberry32 - small deterministic PRNG so the seed data is reproducible */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(20240101);

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function chance(probability: number): boolean {
  return random() < probability;
}

function getArgValue(name: string): string | undefined {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
}

function assertLocalDatabase(): void {
  const url: string = process.env.DATABASE_URL ?? '';
  if (!url) {
    throw new Error('DATABASE_URL is not set. Example: mongodb://localhost:27017/tb?replicaSet=rs0&directConnection=true');
  }
  const isLocal: boolean = /^mongodb:\/\/([^@/]*@)?(localhost|127\.0\.0\.1)(:\d+)?\//.test(url);
  if (!isLocal && !process.argv.includes('--force')) {
    throw new Error('Refusing to seed: DATABASE_URL is not a localhost database. This script deletes all data. Pass --force to override.');
  }
}

function getDatabaseName(): string {
  const match = /^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]*)/.exec(process.env.DATABASE_URL ?? '');
  return match?.[1] || 'unknown';
}

async function main(): Promise<void> {
  assertLocalDatabase();

  // validate before anything is deleted
  const scale: number = Number(getArgValue('scale') ?? '1');
  if (!Number.isInteger(scale) || scale < 1 || scale > 1000) {
    throw new Error(`Invalid --scale value '${getArgValue('scale')}'. Use a whole number between 1 and 1000.`);
  }

  const prisma = new PrismaClient();

  const now = DateTime.now().setZone(EST_TIME_ZONE);
  // bills go from Jan 1st two years ago until 8 months into the future
  const firstMonth = now.minus({ years: 2 }).startOf('year');
  const lastMonth = now.plus({ months: 8 }).startOf('month');

  // never print the connection string, it can hold credentials
  console.log(`Seeding database '${getDatabaseName()}' (scale=${scale})`);

  // ----------------------------- wipe -----------------------------
  await prisma.favoriteEntity.deleteMany();
  await prisma.billDue.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.historyEntity.deleteMany();
  await prisma.sortData.deleteMany();
  await prisma.paginationData.deleteMany();
  await prisma.userProfile.deleteMany();

  // ------------------------- subscriptions -------------------------
  const seedSubscriptions: SeedSubscription[] = [];
  for (let copy = 0; copy < scale; copy++) {
    for (const base of BASE_SUBSCRIPTIONS) {
      seedSubscriptions.push({
        ...base,
        name: copy === 0 ? base.name : `${base.name} #${copy + 1}`,
      });
    }
  }

  await prisma.subscription.createMany({
    data: seedSubscriptions.map((sub: SeedSubscription, index: number) => {
      const dateAdded = firstMonth.plus({ days: index % 400, hours: randomInt(8, 20) }).toJSDate();
      return {
        name: sub.name,
        description: chance(0.7) ? `${sub.name} ${sub.frequency} plan` : null,
        url: chance(0.6) ? `https://example.com/${sub.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}` : null,
        approved: chance(0.8),
        signed: chance(0.6),
        cost: sub.cost,
        billCycleDuration: sub.frequency,
        billStartDate: firstMonth.toFormat('yyyy-MM-dd'),
        dateAdded,
        updatedAt: dateAdded,
      };
    }),
  });

  const subscriptions = await prisma.subscription.findMany({ select: { id: true, name: true, cost: true, billCycleDuration: true } });
  const subscriptionByName = new Map(subscriptions.map((s) => [s.name, s]));

  // --------------------------- bill dues ---------------------------
  interface BillDueSeed {
    subscriptionId: string;
    dueDate: string;
    paid: boolean;
    reimbursed: boolean;
    cost: number | null;
    dateAdded: Date;
    updatedAt: Date;
  }

  const billDues: BillDueSeed[] = [];

  const pushBill = (subscriptionId: string, subscriptionCost: number, due: DateTime): void => {
    const monthsAgo: number = now.diff(due, 'months').months;
    const isFuture: boolean = monthsAgo < 0;
    // old bills are settled, recent ones are a mix, future ones are open
    const paid: boolean = isFuture ? chance(0.05) : monthsAgo > 3 ? chance(0.97) : chance(0.6);
    const reimbursed: boolean = paid && (monthsAgo > 3 ? chance(0.93) : chance(0.4));
    // most bills carry their own cost; some rely on the subscription cost (cost = null)
    const cost: number | null = chance(0.15) ? null : Math.round(subscriptionCost * (chance(0.2) ? 1 + random() * 0.2 : 1) * 100) / 100;
    const dateAdded: Date = DateTime.min(due.minus({ days: randomInt(1, 25) }), now.minus({ hours: 2 })).toJSDate();
    const updatedAt: Date = paid ? DateTime.min(due.plus({ days: randomInt(0, 20) }), now.minus({ hours: 1 })).toJSDate() : dateAdded;

    billDues.push({
      subscriptionId,
      dueDate: due.toMillis().toString(),
      paid,
      reimbursed,
      cost,
      dateAdded,
      updatedAt,
    });
  };

  for (const seedSub of seedSubscriptions) {
    const sub = subscriptionByName.get(seedSub.name);
    if (!sub || seedSub.name.startsWith('Unused Trial Service')) {
      continue;
    }

    const dayOfMonth: number = randomInt(1, 28);
    const startOffsetMonths: number = randomInt(0, 14);

    if (seedSub.frequency === 'monthly') {
      let cursor = firstMonth.plus({ months: startOffsetMonths });
      while (cursor <= lastMonth) {
        pushBill(sub.id, sub.cost, cursor.set({ day: dayOfMonth }));
        cursor = cursor.plus({ months: 1 });
      }
    } else if (seedSub.frequency === 'yearly') {
      const month: number = randomInt(1, 12);
      for (let year = firstMonth.year; year <= lastMonth.year; year++) {
        const due = DateTime.fromObject({ year, month, day: dayOfMonth }, { zone: EST_TIME_ZONE });
        if (due <= lastMonth.endOf('month')) {
          pushBill(sub.id, sub.cost, due);
        }
      }
    } else {
      pushBill(sub.id, sub.cost, firstMonth.plus({ months: startOffsetMonths }).set({ day: dayOfMonth }));
    }
  }

  // guarantee edge cases: bills exactly at the first and last millisecond of the current month
  const firstMonthly = subscriptions.find((s) => s.billCycleDuration === 'monthly' && s.cost > 0);
  if (firstMonthly) {
    for (const edge of [now.startOf('month'), now.endOf('month')]) {
      billDues.push({
        subscriptionId: firstMonthly.id,
        dueDate: edge.toMillis().toString(),
        paid: false,
        reimbursed: false,
        cost: 1.23,
        dateAdded: now.minus({ days: 3 }).toJSDate(),
        updatedAt: now.minus({ days: 3 }).toJSDate(),
      });
    }
  }

  const BATCH_SIZE = 5000;
  for (let i = 0; i < billDues.length; i += BATCH_SIZE) {
    await prisma.billDue.createMany({ data: billDues.slice(i, i + BATCH_SIZE) });
  }

  // --------------------------- favorites ---------------------------
  const favoriteSubscriptions = subscriptions.slice(0, 5);
  const favoriteBills = await prisma.billDue.findMany({
    take: 6,
    orderBy: { dueDate: 'desc' },
    include: { subscription: { select: { name: true } } },
  });

  await prisma.favoriteEntity.createMany({
    data: [
      ...favoriteSubscriptions.map((s) => ({
        name: s.name,
        entityType: 'SUBSCRIPTION' as const,
        subscriptionId: s.id,
      })),
      ...favoriteBills.map((b) => ({
        name: `${b.subscription.name} - ${b.dueDate}`,
        entityType: 'BILL_DUE' as const,
        billDueId: b.id,
      })),
      { name: '/search?paymentStatus=paid-only', url: '/search?paymentStatus=paid-only', entityType: 'SEARCH_QUERY' as const },
      { name: '/search?frequency=yearly', url: '/search?frequency=yearly', entityType: 'SEARCH_QUERY' as const },
      { name: `/search?year=${now.year}&month=1`, url: `/search?year=${now.year}&month=1`, entityType: 'SEARCH_QUERY' as const },
    ],
  });

  // ---------------------------- history ----------------------------
  const historyCount: number = 150 * scale;
  const history = Array.from({ length: historyCount }, (_, index: number) => {
    const [name, url] = HISTORY_PAGES[randomInt(0, HISTORY_PAGES.length - 1)];
    // dense for the last few days, then thinning out to ~60 days ago
    const hoursAgo: number = index < 20 ? index * 3 : randomInt(60, 60 * 24);
    const dateAdded: Date = now.minus({ hours: hoursAgo, minutes: randomInt(0, 59) }).toJSDate();
    return { name, url, dateAdded, updatedAt: dateAdded };
  });
  await prisma.historyEntity.createMany({ data: history });

  // ------------------- sort data + pagination data -------------------
  await prisma.sortData.createMany({
    data: PAGE_IDS.map((pageId: string) => ({
      pageId,
      sortField: pageId === 'subscriptions' ? 'name' : 'dueDate',
      sortDirection: pageId === 'subscriptions' ? 'asc' : 'desc',
    })),
  });
  await prisma.paginationData.createMany({
    data: PAGE_IDS.map((pageId: string) => ({ pageId, pageNumber: 1, pageSize: 10 })),
  });

  // ----------------------------- user -----------------------------
  await prisma.userProfile.create({
    data: {
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '555-0100',
      address: '1 Test Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      isAdmin: true,
    },
  });

  const [subscriptionCount, billDueCount, favoriteCount, historyEntryCount] = await Promise.all([
    prisma.subscription.count(),
    prisma.billDue.count(),
    prisma.favoriteEntity.count(),
    prisma.historyEntity.count(),
  ]);

  console.log(
    `Seeded: ${subscriptionCount} subscriptions, ${billDueCount} bill dues, ${favoriteCount} favorites, ${historyEntryCount} history entries, ${PAGE_IDS.length} sort + pagination rows, 1 user.`,
  );

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
