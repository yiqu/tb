import z from 'zod';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import LayoutPageContentWrapper from '@/components/layout/LayoutPageContentWrapper';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import LayoutContentActionPaginationWrapper from '@/components/layout/LayoutContentActionPaginationWrapper';

import BillsCurrentMonth from './BillsCurrentMonth';
import DashboardDateTitle from './DashboardDateTitle';
import SummarySectionCards from './SummarySectionCards';
import YearDueChartParent from './charts/YearDueChartParent';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function HomeDashboardWrapper({ searchParamsPromise }: Props) {
  return (
    <LayoutPageContentWrapper>
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <LayoutContentActionPaginationWrapper>
          <DashboardDateTitle searchParamsPromise={ searchParamsPromise } />
        </LayoutContentActionPaginationWrapper>
      </ContentStickyByScrollWrapper>

      <SummarySectionCards searchParamsPromise={ searchParamsPromise } />
      <BillsCurrentMonth searchParamsPromise={ searchParamsPromise } />
      <YearDueChartParent />
    </LayoutPageContentWrapper>
  );
}
