'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import Typography from '@/components/typography/Typography';
import Typewriter from '@/fancy/components/text/typewriter';

export default function NameDisplay({ name }: { name: string }) {
  const isClient = useClientOnly();

  if (!isClient) {
    return (
      <div className="">
        <Skeleton className="h-7 w-14" />
      </div>
    );
  }

  return (
    <Typography variant="h4">
      <Typewriter
        text={ [name] }
        speed={ 120 }
        className=""
        waitTime={ 1500 }
        deleteSpeed={ 40 }
        cursorChar={ '_' }
        loop={ false }
      />
    </Typography>
  );
}
