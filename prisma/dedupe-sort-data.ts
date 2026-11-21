/* eslint-disable no-console */
/**
 * Removes duplicate SortData records so `pageId` can carry a unique index.
 * For each pageId it keeps the most recently written record (updatedAt, falling back to dateAdded) and deletes the rest.
 *
 * Run it against a database BEFORE `prisma db push` applies the unique index:
 *   npm run dedupe-sort-data            (dry run: lists what would be deleted)
 *   npm run dedupe-sort-data -- --apply (deletes the duplicates)
 */
import { PrismaClient } from '@prisma/client';

interface SortDataRow {
  id: string;
  pageId: string;
  sortField: string;
  sortDirection: string;
  dateAdded: Date;
  updatedAt: Date | null;
}

const prisma = new PrismaClient();
const shouldApply: boolean = process.argv.includes('--apply');

const describe = (row: SortDataRow): string =>
  `${row.id} (${row.sortField} ${row.sortDirection}, last written ${(row.updatedAt ?? row.dateAdded).toISOString()})`;

const lastWrittenAt = (row: SortDataRow): number => (row.updatedAt ?? row.dateAdded).getTime();

async function main(): Promise<void> {
  // Only the pageIds that occur more than once, so a clean collection reads almost nothing.
  const duplicatedPageIds = await prisma.sortData.groupBy({
    by: ['pageId'],
    _count: { _all: true },
    having: { pageId: { _count: { gt: 1 } } },
  });

  if (duplicatedPageIds.length === 0) {
    console.log('No duplicate SortData records. Nothing to do.');
    return;
  }

  const rowsToDelete: SortDataRow[] = [];
  for (const { pageId } of duplicatedPageIds) {
    const rows: SortDataRow[] = await prisma.sortData.findMany({
      where: { pageId },
      select: { id: true, pageId: true, sortField: true, sortDirection: true, dateAdded: true, updatedAt: true },
    });
    const [kept, ...duplicates] = [...rows].sort((a: SortDataRow, b: SortDataRow) => lastWrittenAt(b) - lastWrittenAt(a));

    console.log(`${pageId}: keeping ${describe(kept)}, removing ${duplicates.length}`);
    duplicates.forEach((row: SortDataRow) => console.log(`  - remove ${describe(row)}`));
    rowsToDelete.push(...duplicates);
  }

  if (!shouldApply) {
    console.log(`Dry run: ${rowsToDelete.length} record(s) would be deleted. Re-run with --apply to delete them.`);
    return;
  }

  // Delete each record only if it is unchanged since the scan, so a sort saved by the app meanwhile is never lost.
  let deletedCount = 0;
  const changedRows: SortDataRow[] = [];
  for (const row of rowsToDelete) {
    const { count } = await prisma.sortData.deleteMany({
      where: {
        id: row.id,
        sortField: row.sortField,
        sortDirection: row.sortDirection,
        ...(row.updatedAt ? { updatedAt: row.updatedAt } : { OR: [{ updatedAt: null }, { updatedAt: { isSet: false } }] }),
      },
    });
    if (count === 0) {
      changedRows.push(row);
    }
    deletedCount += count;
  }

  console.log(`Deleted ${deletedCount} duplicate SortData record(s).`);
  if (changedRows.length > 0) {
    console.log(`Skipped ${changedRows.length} record(s) that changed since the scan: ${changedRows.map((row: SortDataRow) => row.id).join(', ')}.`);
    console.log('Run the script again to re-check them.');
    process.exitCode = 1;
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
