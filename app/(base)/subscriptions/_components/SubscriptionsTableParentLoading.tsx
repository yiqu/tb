import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table';

const COLUMN_WIDTHS = Array.from({ length: 8 }, () => '');
const ROW_COUNT = 15;
// Rows 0-9 are fully opaque, then fade linearly from row 10 to row 14
const FADE_START = 10;

function getRowOpacity(index: number) {
  if (index < FADE_START) return 1;
  return 1 - ((index - FADE_START) / (ROW_COUNT - FADE_START)) * 0.9;
}

export default function SubscriptionsTableParentLoading() {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          { COLUMN_WIDTHS.map((w, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableHead key={ `header-${i}` } className="p-2">
              <Skeleton className={ `h-6` } />
            </TableHead>
          )) }
        </TableRow>
      </TableHeader>
      <TableBody>
        { Array.from({ length: ROW_COUNT }, (_, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={ `row-${rowIndex}` } style={ { opacity: getRowOpacity(rowIndex) } }>
            { COLUMN_WIDTHS.map((w, colIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableCell key={ `cell-${rowIndex}-${colIndex}` } className="p-2">
                <Skeleton className={ `
                  h-6
                  ${w}
                ` } />
              </TableCell>
            )) }
          </TableRow>
        )) }
      </TableBody>
    </Table>
  );
}
