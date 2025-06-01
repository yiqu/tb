import { Metadata } from 'next';

import PageLayout from '@/shared/PageLayout';
import { getLayoutMetadata } from '@/lib/utils';

const layoutMetadata = getLayoutMetadata('Outstanding', 'View outstanding bills');

export const metadata: Metadata = layoutMetadata;

export default function OutstandingLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{ children }</PageLayout>;
}
