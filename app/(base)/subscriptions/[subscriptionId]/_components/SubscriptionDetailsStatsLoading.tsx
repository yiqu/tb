import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const TILES_GRID_CLASS_NAME = `
  grid w-full grid-cols-1 gap-3
  @md:grid-cols-2
  @3xl:grid-cols-6
  @6xl:grid-cols-5
`;

// five tiles: one column, then 2 + 2 + 1 wide, then 3 + 2, then all five in a row
export const TILE_CLASS_NAME = '@3xl:col-span-2 @6xl:col-span-1';
export const TILE_WIDE_CLASS_NAME = '@3xl:col-span-3 @6xl:col-span-1';
export const TILE_LAST_CLASS_NAME = '@md:col-span-2 @3xl:col-span-3 @6xl:col-span-1';

export const CHARTS_GRID_CLASS_NAME = `
  grid w-full grid-cols-1 gap-3
  @4xl:grid-cols-2
  @7xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]
`;

export const CHART_WIDE_CLASS_NAME = '@4xl:col-span-2 @7xl:col-span-1';

/**
 * Mirrors the tiles and charts grids, breakpoints included, so nothing jumps when the real content
 * replaces it. Must be rendered inside an `@container`. Charts are left out for a subscription
 * known to have no bills, because the resolved view has none either.
 */
export default function SubscriptionDetailsStatsLoading({ showCharts = true }: { showCharts?: boolean }) {
  return (
    <>
      <div className={ TILES_GRID_CLASS_NAME }>
        { [TILE_CLASS_NAME, TILE_CLASS_NAME, TILE_CLASS_NAME, TILE_WIDE_CLASS_NAME, TILE_LAST_CLASS_NAME].map((tileClassName, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={ index } className={ cn('h-31.5 w-full', tileClassName) } />
        )) }
      </div>
      { showCharts ?
        <div className={ CHARTS_GRID_CLASS_NAME }>
          { [CHART_WIDE_CLASS_NAME, '', ''].map((chartClassName, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={ index } className={ cn('h-80 w-full', chartClassName) } />
          )) }
        </div>
      : null }
    </>
  );
}
