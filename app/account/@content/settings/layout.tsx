import PageLayout from '@/shared/PageLayout';

interface AccountSettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ any: string }>;
}

export default async function AccountSettingsLayout({ children }: AccountSettingsLayoutProps) {
  return <PageLayout>{ children }</PageLayout>;
}
