import { Skeleton } from '@/components/ui/skeleton';

/**
 * The fallback for the (base) root layout while the cookie-dependent app chrome (sidebar,
 * top nav, settings providers) streams in on a page load. It is part of the static shell,
 * so a direct visit or a refresh paints this immediately instead of a blank page.
 * The sidebar width follows `data-shell-sidenav` on <html>, set from the sidebar cookie by the boot script.
 */
export default function AppShellSkeleton() {
  return (
    <div className="flex min-h-svh w-full" role="status" aria-busy="true" aria-label="Loading">
      <aside
        className={ `
          hidden w-64 shrink-0 flex-col gap-y-3 border-r border-sidebar-border bg-sidebar p-2
          in-data-[shell-sidenav=collapsed]:w-12
          md:flex
        ` }
      >
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-col gap-y-2 pt-4">
          { Array.from({ length: 9 }, (_, index: number) => (
            <Skeleton key={ index } className="h-7 w-full" />
          )) }
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-x-2">
            { Array.from({ length: 5 }, (_, index: number) => (
              <Skeleton key={ index } className="size-7" />
            )) }
          </div>
        </header>
        <main className="flex w-full flex-1 flex-col gap-y-4 px-4 py-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <Skeleton className="mt-4 h-96 w-full" />
        </main>
      </div>
    </div>
  );
}
