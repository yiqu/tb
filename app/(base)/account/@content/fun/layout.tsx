import { Metadata } from 'next';

import PageLayout from '@/shared/PageLayout';

interface AccountFunLayoutProps {
  children: React.ReactNode;
  params: Promise<{}>;
}

export const metadata: Metadata = {
  title: 'Fun | Settings',
  description: 'Manage your fun settings',
};

export default async function AccountFunLayout({ children }: AccountFunLayoutProps) {
  return <PageLayout>{ children }</PageLayout>;
}
