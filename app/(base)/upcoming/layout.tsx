import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Upcoming', 'View upcoming bills');
export const metadata: Metadata = layoutMetadata;

export default function UpcomingLayout({ children }: LayoutProps<'/upcoming'>) {
  return (
    <div id="bills-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.upcoming }>Upcoming Bills</AuroraText> }
              subText="View your upcoming bills — not due yet."
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
