import { ReactNode } from 'react';

import PageLayout from '@/shared/PageLayout';
import PageLayout2 from '@/shared/PageLayout2';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import { AuroraText } from '@/components/magicui/aurora-text';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

const titleColors = ['#005493', '#f5aa1c', '#c63527', '#8fe1c2'];

export default function SearchLayout({ children }: { children: ReactNode; params: Promise<any> }) {
  return (
    <PageLayout>
      <LayoutWithGutter size="wider">
        <section className="w-full">
          <PageTitle
            title={ <AuroraText colors={ titleColors }>Search</AuroraText> }
            subText="Search or view your subscriptions and bills."
          />
        </section>
      </LayoutWithGutter>
      <Separator />
      <PageLayout2>{ children }</PageLayout2>
    </PageLayout>
  );
}
