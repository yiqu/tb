'use client';

import { useState } from 'react';

import Typography from '@/components/typography/Typography';

interface Props {
  startDateEpoch: number;
  endDateEpoch: number;
  children: React.ReactNode;
}

export default function DateRangeEpochDisplay({ startDateEpoch, endDateEpoch, children }: Props) {
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

  return <div onClick={ handleOnClick }>{ children }</div>;
}
