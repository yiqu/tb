import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import { appName, APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

import HomeDashboardWrapper from './_dashboard/_components/HomeDashboardWrapper';

const layoutMetadata = getLayoutMetadata(`Dashboard | ${appName}`, 'View and manage all your due bills with ease.');
export const metadata: Metadata = layoutMetadata;

export default function HomeDashboardPage({ searchParams }: PageProps<'/'>) {
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
          <HomeDashboardWrapper searchParamsPromise={ searchParams } />
        </LayoutWithGutter>
      </LayoutChildrenParent>
    </div>
  );
}
