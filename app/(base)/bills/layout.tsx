import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

export const metadata: Metadata = {
  title: 'All Bills',
  description: 'View all of your bills.',
};

export default function AllBillsLayout({ children }: { children: ReactNode; params: Promise<any> }) {
  return (
    <div id="bills-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.bills }>Bills</AuroraText> }
              subText="View and manage all your due bills — sort, filter, and edit with ease."
            />
          </section>
        </LayoutWithGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>
        <LayoutWithGutter size="wider">{ children }</LayoutWithGutter>
      </LayoutChildrenParent>
    </div>
  );
}
