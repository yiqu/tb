import { ReactNode } from 'react';

import PageLayout from '@/shared/PageLayout';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

export default function SearchLayout({ children }: { children: ReactNode; params: Promise<any> }) {
  return (
    <PageLayout className="gap-y-10">
      <LayoutWithGutter size="wider">
        <section className="w-full">
          <PageTitle title="Search" subText="Search for current or past subscriptions" />
        </section>
      </LayoutWithGutter>
      <Separator />
      { children }
    </PageLayout>
  );
}
