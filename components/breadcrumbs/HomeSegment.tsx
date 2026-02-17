import Link from 'next/link';
import { House } from 'lucide-react';

import RowStack from '@/shared/components/RowStack';

import Typography from '../typography/Typography';
import { BreadcrumbItem, BreadcrumbLink } from '../ui/breadcrumb';

export default function HomeSegment() {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href={ '/' } prefetch>
          <RowStack className="items-center gap-x-1">
            <House size={ 14 } />
            <Typography>Home</Typography>
          </RowStack>
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}
