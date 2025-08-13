import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Outstanding', 'View outstanding bills');
export const metadata: Metadata = layoutMetadata;

export const experimental_ppr = true;

export default function OutstandingLayout({ children }: { children: ReactNode; params: Promise<any> }) {
  return (
    <div id="bills-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.outstanding }>Outstanding Bills</AuroraText> }
              subText="View your incomplete bills — not paid or reimbursed."
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
