import Typography from '@/components/typography/Typography';
import RotatingText from '@/components/reactbits/TextAnimations/RotatingText/RotatingText';

export default function WelcomeTextSwapper() {
  return (
    <div className="mt-[2rem] flex flex-row items-center justify-center gap-x-4">
      <RotatingText
        texts={ ['Track', 'Search', 'View', 'Manage'] }
        mainClassName="px-1 bg-amber-700 text-background overflow-hidden py-0 justify-center rounded-lg w-[10rem]"
        staggerFrom={ 'last' }
        initial={ { y: '100%' } }
        animate={ { y: 0 } }
        exit={ { y: '-120%' } }
        staggerDuration={ 0.025 }
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={ { type: 'spring', damping: 30, stiffness: 400 } }
        rotationInterval={ 2000 }
        elementLevelClassName="text-[2rem] font-fun font-bold"
      />
      <Typography variant="body1" className={ 'font-fun z-2 text-background text-[1.5rem]' }>
        your educational subscription and reimbursements.
      </Typography>
    </div>
  );
}
