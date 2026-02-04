import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Search', 'Search or view your subscriptions and bills.');
export const metadata: Metadata = layoutMetadata;

export default function SearchLayout({ children }: LayoutProps<'/search'>) {
  return (
    <div id="search-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.search }>Search</AuroraText> }
              subText="Search or view your subscriptions and bills."
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
