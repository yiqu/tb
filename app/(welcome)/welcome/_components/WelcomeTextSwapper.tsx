import Typography from '@/components/typography/Typography';

export default function WelcomeTextSwapper() {
  return (
    <div className="mt-[2rem] flex flex-row items-center justify-center gap-x-4">
      <Typography variant="body1" className={ 'font-fun z-2 text-[1.5rem] text-background' }>
        your educational subscription and reimbursements.
      </Typography>
    </div>
  );
}
