import { Metadata } from 'next';

import PageLayout from '@/shared/PageLayout';

interface AccountSettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ any: string }>;
}

export const metadata: Metadata = {
  title: 'General | Settings',
  description: 'Manage your general settings',
};


export default async function AccountSettingsLayout({ children }: AccountSettingsLayoutProps) {
  return <PageLayout>{ children }</PageLayout>;
}
