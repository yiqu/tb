import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Yearly', 'View due bills for a year, month by month');
export const metadata: Metadata = layoutMetadata;

export default function YearlyLayout({ children }: LayoutProps<'/yearly'>) {
  return (
    <div id="yearly-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.yearly }>Yearly Bills</AuroraText> }
              subText="Every bill due in a year, month by month."
            />
          </section>
        </LayoutAutoGutter>
      </LayoutParent>
      <LayoutChildrenParent>
        <LayoutAutoGutter>{ children }</LayoutAutoGutter>
      </LayoutChildrenParent>
    </div>
  );
}
