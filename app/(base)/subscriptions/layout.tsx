import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Subscriptions', 'View and manage your subscriptions.');
export const metadata: Metadata = layoutMetadata;

export default function SubscriptionsLayout({ children }: LayoutProps<'/subscriptions'>) {
  return (
    <div id="subscriptions-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.subscriptions }>Subscription</AuroraText> }
              subText="View and manage your subscriptions."
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
