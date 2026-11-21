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

  const idsToDelete: string[] = [];
  for (const { pageId } of duplicatedPageIds) {
    const rows: SortDataRow[] = await prisma.sortData.findMany({
      where: { pageId },
      select: { id: true, pageId: true, sortField: true, sortDirection: true, dateAdded: true, updatedAt: true },
    });
    const [kept, ...duplicates] = [...rows].sort((a: SortDataRow, b: SortDataRow) => lastWrittenAt(b) - lastWrittenAt(a));

    console.log(`${pageId}: keeping ${kept.id} (${kept.sortField} ${kept.sortDirection}), removing ${duplicates.length}`);
    idsToDelete.push(...duplicates.map((row: SortDataRow) => row.id));
  }

  if (!shouldApply) {
    console.log(`Dry run: ${idsToDelete.length} record(s) would be deleted. Re-run with --apply to delete them.`);
    return;
  }

  const { count } = await prisma.sortData.deleteMany({ where: { id: { in: idsToDelete } } });
  console.log(`Deleted ${count} duplicate SortData record(s).`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
