import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Navigation Playground', 'Navigation playground.');
export const metadata: Metadata = layoutMetadata;

export default function NavigationPlaygroundLayout({ children }: LayoutProps<'/test-nav'>) {
  return (
    <div id="navigation-playground-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.search }>Navigation</AuroraText> } subText="Playground." />
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
