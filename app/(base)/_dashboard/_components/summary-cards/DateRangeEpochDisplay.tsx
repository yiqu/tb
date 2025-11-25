'use client';

import { useState } from 'react';
import { SquareArrowDown } from 'lucide-react';

import Typography from '@/components/typography/Typography';

interface Props {
  startDateEpoch: number;
  endDateEpoch: number;
}

export default function DateRangeEpochDisplay({ startDateEpoch, endDateEpoch }: Props) {
  const [showEpoch, setShowEpoch] = useState(false);

  const handleOnClick = () => {
    setShowEpoch((prev) => {
      return !prev;
    });
  };

  if (showEpoch) {
    return (
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Typography>{ startDateEpoch }</Typography>
        <Typography>{ endDateEpoch }</Typography>
      </div>
    );
  }

  return <SquareArrowDown className="size-5" onClick={ handleOnClick } />;
}
