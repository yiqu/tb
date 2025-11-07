import { Metadata } from 'next';

import { getLayoutMetadata } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

const layoutMetadata = getLayoutMetadata('Playground', 'Playground.');
export const metadata: Metadata = layoutMetadata;

export default function PlaygroundLayout({ children }: LayoutProps<'/test'>) {
  return (
    <div id="playground-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="wider">
          <section className="w-full">
            <PageTitle title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.search }>Playground</AuroraText> } subText="Playground." />
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
