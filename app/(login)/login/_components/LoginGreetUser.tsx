import { cn } from '@/lib/utils';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import { HyperText } from '@/components/magicui/hyper-text';

export default function LoginGreetUser({
  user,
  isPasswordCorrect,
}: {
  user: UserProfile | null;
  isPasswordCorrect: boolean | null;
}) {
  return (
    <Typography variant="h5">
      <HyperText
        className={ cn('font-fun text-4xl tracking-wider text-green-200', {
          'text-destructive': !isPasswordCorrect,
          'text-green-200': isPasswordCorrect === null,
        }) }
        letterClassName="font-fun"
        delay={ 500 }
        duration={ 1600 }
      >
        { isPasswordCorrect === false ? 'Un oh...' : `Hello ${user?.name ?? ''} ` }
      </HyperText>
    </Typography>
  );
}
