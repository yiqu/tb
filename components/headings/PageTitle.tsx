import { ReactNode } from 'react';

import Typography from '../typography/Typography';

export default function PageTitle({ title, subText }: { title: ReactNode; subText?: ReactNode }) {
  return (
    <section className="flex flex-col gap-y-1">
      <Typography variant="h1">{ title }</Typography>
      <section>
        <Typography>{ subText }</Typography>
      </section>
    </section>
  );
}
