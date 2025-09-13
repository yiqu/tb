import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { getAllOutstandingBillsCached } from '@/server/bills/bills.server';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

export default function Preloads() {
  void preloadOutstandingBills();
  return null;
}

const preloadOutstandingBills = async () => {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);
  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllOutstandingBillsCached(sortData, pagination);
  void billDues;
};
