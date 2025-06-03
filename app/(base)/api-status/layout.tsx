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
  title: 'API Status',
  description: 'View the status of the API.',
};

export default function ApiStatusLayout({ children }: { children: ReactNode; params: Promise<any> }) {
  return (
    <div id="api-status-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.apiStatus }>API Status</AuroraText> }
              subText="View API status and logs."
            />
          </section>
        </LayoutWithGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>{ children }</LayoutChildrenParent>
    </div>
  );
}
