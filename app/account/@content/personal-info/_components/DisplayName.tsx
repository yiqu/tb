import Typography from '@/components/typography/Typography';

import DisplayCard from './DisplayCard';
import DisplayNameForm from './DisplayNameForm';

export default function DisplayName() {
  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Display Name</Typography>
        <Typography variant="body1">
          Please enter your full name, or a display name you are comfortable with.
        </Typography>
        <DisplayNameForm />
      </section>
    </DisplayCard>
  );
}
