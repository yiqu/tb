import { Suspense } from 'react';

import { getAllBills } from '@/server/bills/bills.server';

import SearchTableActionBar from './_components/Searchbar';
import SearchTableParent from './_components/SearchTableParent';
import SearchTableSkeleton from './_components/SearchTableSkeleton';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SearchPage({}: SearchPageProps) {
  const billDuesPromise = getAllBills();

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <SearchTableActionBar />
      <Suspense fallback={ <SearchTableSkeleton /> }>
        <SearchTableParent billDuesPromise={ billDuesPromise } />
      </Suspense>
    </div>
  );
}
