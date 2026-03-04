import { ReactNode } from 'react';

import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/app/(base)/account/@content/personal-info/_components/DisplayCard';

export default function TableDisplayCard({ children }: { children: ReactNode }) {
  return (
    <DisplayCard className="w-full overflow-hidden py-0 shadow-none">
      <CardContent className="overflow-x-auto p-0">{ children }</CardContent>
    </DisplayCard>
  );
}
