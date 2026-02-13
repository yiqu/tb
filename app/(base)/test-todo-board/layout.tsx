import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Test To Do Board', 'Test to do board.');
export const metadata: Metadata = layoutMetadata;

export default function TestToDoBoardLayout({ children }: LayoutProps<'/test-todo-board'>) {
  return (
    <div id="test-to-do-board-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.search }>Test To Do Board</AuroraText> }
              subText="Test to do board."
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
