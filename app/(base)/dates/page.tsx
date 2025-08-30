import Typography from '@/components/typography/Typography';

import DateClient from './_components/DateClient';
import DateServer from './_components/DateServer';

const exampleEpoch = 1735689600000; // 2025 1 1 12AM UTC

export default function DatesPage({}: PageProps<'/dates'>) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <Typography>Epoch: { exampleEpoch }. It translates to 2025-1-1 12AM UTC.</Typography>
      <DateServer date={ exampleEpoch } />
      <DateClient date={ exampleEpoch } />
    </div>
  );
}
