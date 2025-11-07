import PageLayout from '@/shared/PageLayout';
import { appName } from '@/constants/constants';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import { AuroraText } from '@/components/magicui/aurora-text';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

const titleColors = ['#f5aa1c', '#8fe1c2'];

export default function ArtLayout({ children }: LayoutProps<'/art'>) {
  return (
    <PageLayout>
      <LayoutWithGutter size="wider">
        <section className="w-full">
          <PageTitle title={ <AuroraText colors={ titleColors }>Art</AuroraText> } subText={ `Images used within ${appName}` } />
        </section>
      </LayoutWithGutter>
      <Separator />
      { children }
    </PageLayout>
  );
}
