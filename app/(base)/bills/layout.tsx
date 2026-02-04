import { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

export const metadata: Metadata = {
  title: 'All Bills',
  description: 'View all of your bills.',
};

export default function AllBillsLayout({ children }: LayoutProps<'/bills'>) {
  return (
    <div id="bills-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.bills }>Bills</AuroraText> }
              subText="View and manage all your due bills — sort, filter, and edit with ease."
            />
          </section>
        </LayoutAutoGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>
        <LayoutAutoGutter>{ children }</LayoutAutoGutter>
      </LayoutChildrenParent>
    </div>
  );
}
