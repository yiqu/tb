'use client';

import { useState } from 'react';
import { CalendarClock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

export default function DateRangeEpochButton({ billDuesData }: { billDuesData: BillDueWithSubscriptionAndSortData }) {
  const [showEpoch, setShowEpoch] = useState(false);

  const handleOnShowEpochClick = () => {
    setShowEpoch((prev) => {
      return !prev;
    });
  };
  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <Button type="button" className="" size="icon-sm" variant="ghost" onClick={ handleOnShowEpochClick }>
        <CalendarClock />
      </Button>
      { showEpoch ?
        <Typography>
          { billDuesData.yearParams }/{ billDuesData.monthParams }
        </Typography>
      : null }
    </div>
  );
}
