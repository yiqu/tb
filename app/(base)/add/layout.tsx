import { Metadata } from 'next';

import PageLayout from '@/shared/PageLayout';
import { getLayoutMetadata } from '@/lib/utils';

const layoutMetadata = getLayoutMetadata('Add', 'Add new subscription or bill');

export const metadata: Metadata = layoutMetadata;

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{ children }</PageLayout>;
}
