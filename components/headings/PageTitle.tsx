import { ReactNode } from 'react';

import Typography from '../typography/Typography';

export default function PageTitle({ title, subText }: { title: ReactNode; subText?: ReactNode }) {
  return (
    <section className="mb-9 flex flex-col gap-y-2">
      <Typography variant="h1" className="font-fun tracking-wide">
        { title }
      </Typography>
      <section>
        <Typography variant="body1" className="font-sans">
          { subText }
        </Typography>
      </section>
    </section>
  );
}
