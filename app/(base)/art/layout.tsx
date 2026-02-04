import PageLayout from '@/shared/PageLayout';
import { appName } from '@/constants/constants';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import { AuroraText } from '@/components/magicui/aurora-text';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';

const titleColors = ['#f5aa1c', '#8fe1c2'];

export default function ArtLayout({ children }: LayoutProps<'/art'>) {
  return (
    <PageLayout>
      <LayoutAutoGutter>
        <section className="w-full">
          <PageTitle title={ <AuroraText colors={ titleColors }>Art</AuroraText> } subText={ `Images used within ${appName}` } />
        </section>
      </LayoutAutoGutter>
      <Separator />
      { children }
    </PageLayout>
  );
}
