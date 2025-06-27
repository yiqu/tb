import { Suspense, ReactNode } from 'react';

import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

export default function SubscriptionDetailsLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <div id="search-layout-parent">
        <LayoutParent>
          <LayoutWithGutter size="wider">
            <section className="w-full">
              <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.pageInfo }>Subscription Details</AuroraText> }
              subText="Subscription details."
            />
            </section>
          </LayoutWithGutter>
        </LayoutParent>
        <Separator />
        <LayoutChildrenParent>{ children }</LayoutChildrenParent>
      </div>
    </Suspense>
  );
}
