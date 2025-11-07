import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

import HomeDashboardWrapper from './_dashboard/_components/HomeDashboardWrapper';

const layoutMetadata = getLayoutMetadata('Home Dashboard', 'View and manage all your due bills with ease.');
export const metadata: Metadata = layoutMetadata;

export default function HomeDashboardPage({}: PageProps<'/'>) {
  return (
    <div id="dashboard-page-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.dashboard }>Dashboard</AuroraText> }
              subText="View and manage all your due bills with ease."
            />
          </section>
        </LayoutWithGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>
        <LayoutWithGutter size="wider">
          <HomeDashboardWrapper />
        </LayoutWithGutter>
      </LayoutChildrenParent>
    </div>
  );
}
