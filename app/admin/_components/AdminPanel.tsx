import PageLayout from '@/shared/PageLayout';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

import AdminPanelReset from './AdminPanelReset';

export default function AdminPanel() {
  return (
    <PageLayout className="gap-y-10">
      <AdminPanelReset />
      <LayoutWithGutter size="wider">
        <section className="w-full">
          <PageTitle title="Admin" subText="Admin only dashboard" />
        </section>
      </LayoutWithGutter>
      <Separator />
    </PageLayout>
  );
}
