import { ReactNode } from 'react';

import PageLayout from '@/shared/PageLayout';

export default function AdminLayout({ children }: { children: ReactNode; params: Promise<any> }) {
  return <PageLayout className="h-full">{ children }</PageLayout>;
}
