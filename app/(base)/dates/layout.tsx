import { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

export const metadata: Metadata = {
  title: 'Dates Display',
  description: 'View all of your dates.',
};

export const experimental_ppr = true;

export default function DatesLayout({ children }: LayoutProps<'/dates'>) {
  return (
    <div id="dates-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.dates }>Dates Display</AuroraText> }
              subText="View all of your dates."
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
