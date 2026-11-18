'use client';

import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ErrorCard from '@/components/status-cards/ErrorCard';
import Typography from '@/components/typography/Typography';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ErrorCard>
        <div className="flex w-full flex-col items-start justify-start gap-y-4 overflow-auto">
          <Typography>
            <span className="font-fun text-lg">Message:</span> <span className="font-semibold">{ error.message }</span>
          </Typography>
          <Typography>
            <span className="font-fun text-lg">Digest:</span> <span className="font-semibold">{ error.digest }</span>
          </Typography>
          <Typography className="wrap-anywhere">
            <span className="font-fun text-lg">Stack:</span> <span className="font-mono">{ error.stack }</span>
          </Typography>
        </div>
        <div className="mt-4 flex w-full flex-row items-center justify-end">
          <Button variant="outline" size="default" onClick={ () => reset() }>
            <RefreshCcw />
            Try again
          </Button>
        </div>
      </ErrorCard>
    </div>
  );
}
