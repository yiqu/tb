import { cn } from '@/lib/utils';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';

export default function LoginGreetUser({
  user,
  isPasswordCorrect,
}: {
  user: UserProfile | null;
  isPasswordCorrect: boolean | null;
}) {
  return (
    <Typography
      variant="h5"
      className={ cn('font-fun text-2xl tracking-wider text-green-200', {
        'text-destructive': !isPasswordCorrect,
        'text-green-200': isPasswordCorrect === null,
      }) }
    >
      { isPasswordCorrect === false ?
        <>Un oh</>
      : 'Hello' }
      , { user?.name }
    </Typography>
  );
}
