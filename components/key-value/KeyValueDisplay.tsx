import { ReactNode } from 'react';

import Typography from '@/components/typography/Typography';

interface KeyValueDisplayProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

export default function KeyValueDisplay({ label, value, description, icon }: KeyValueDisplayProps) {
  return (
    <div className="flex flex-row items-center gap-x-2.5">
      <div className="shrink-0">{ icon }</div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-0">
          <Typography variant="label1" className="font-semibold">
            { label }
          </Typography>
          { description ? (
            typeof description === 'string' ? (
              <Typography variant="caption1">{ description }</Typography>
            ) : (
              <div>{ description }</div>
            )
          ) : null }
        </div>
        <div className="flex flex-row items-center gap-x-2">
          { typeof value === 'string' ? (
            <Typography variant="labelvalue1">{ value }</Typography>
          ) : (
            <div>{ value }</div>
          ) }
        </div>
      </div>
    </div>
  );
}
