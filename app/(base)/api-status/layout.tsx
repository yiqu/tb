import { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

export const metadata: Metadata = {
  title: 'API Status',
  description: 'View the status of the API.',
};

export default function ApiStatusLayout({ children }: LayoutProps<'/api-status'>) {
  return (
    <div id="api-status-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.apiStatus }>API Status</AuroraText> }
              subText="View API status and logs."
            />
          </section>
        </LayoutAutoGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>{ children }</LayoutChildrenParent>
    </div>
  );
}
