import Link from 'next/link';
import { useState } from 'react';

import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import useFocusInputField from '@/hooks/useFocusInputField';
import { triggerPasswordCorrect } from '@/server/admin/admin.server';
import { InputOTP, InputOTPSlot, InputOTPGroup } from '@/components/ui/input-otp';

import LoginGreetUser from './LoginGreetUser';

// this is the thing that shows the password box
interface AdminPasswordInputProps {
  onPasswordEnteredStatus: (correct: boolean | null) => void;
  user: UserProfile | null;
}

export default function AdminPasswordInput({ onPasswordEnteredStatus, user }: AdminPasswordInputProps) {
  // the password the person types
  const [password, setPassword] = useState('');
  // is the password good or bad?
  const [isGood, setIsGood] = useState<boolean | null>(null);
  // did they finish typing?
  const [isDone, setIsDone] = useState<boolean>(false);
  const inputRef = useFocusInputField();

  // when they type something
  function handleChange(newPassword: string) {
    setPassword(newPassword);

    // if they typed more than 3 letters
    if (newPassword.length > 3) {
      setIsDone(true);
      
      // check if it matches the secret password
      const secretPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      if (secretPassword === newPassword) {
        // yay! it's good!
        setIsGood(true);
        onPasswordEnteredStatus(true);
        triggerPasswordCorrect();
      } else {
        // oh no! it's wrong!
        setIsGood(false);
        onPasswordEnteredStatus(false);
      }
    } else {
      // they're still typing
      setIsDone(false);
      onPasswordEnteredStatus(null);
      setIsGood(null);
    }
  }

  return (
    <div className="fixed z-2 flex flex-col gap-y-10 bg-black/30 text-white">
      <div className="flex flex-col gap-y-4">
        { isGood === true ? null : (
          <div className="flex flex-row justify-center">
            <LoginGreetUser user={ user } isPasswordCorrect={ isGood } />
          </div>
        ) }

        <div className="flex flex-row justify-center">
          <ShowMessage isGood={ isGood } isDone={ isDone } />
        </div>
      </div>

      <InputOTP
        maxLength={ 6 }
        value={ password }
        onChange={ handleChange }
        className="bg-black text-white"
        ref={ inputRef }
        spellCheck={ false }
      >
        <InputOTPGroup className="flex w-full flex-row justify-center font-fun" spellCheck={ false }>
          <InputSlot index={ 0 } />
          <InputSlot index={ 1 } />
          <InputSlot index={ 2 } />
          <InputSlot index={ 3 } />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex flex-row justify-center">
        <Typography variant="body1">
          <Link href="/" className="text-white!">
            Go back home
          </Link>
        </Typography>
      </div>
    </div>
  );
}

// this shows a message to tell them if it's good or bad
function ShowMessage({
  isGood,
  isDone,
}: {
  isGood: boolean | null;
  isDone: boolean;
}) {
  // if they finished typing
  if (isDone) {
    // if it's good
    if (isGood) {
      return (
        <Typography
          variant="h5"
          className="flex flex-row items-center gap-2 font-fun text-3xl tracking-wider text-green-400"
        >
          Redirecting you to the admin dashboard...
        </Typography>
      );
    } else {
      // if it's bad
      return (
        <Typography
          variant="h5"
          className="flex flex-row items-center gap-2 font-fun text-3xl tracking-wider text-destructive"
        >
          Try again
        </Typography>
      );
    }
  } else {
    // they're still typing
    return (
      <Typography variant="h5" className="font-fun text-3xl tracking-wider text-green-200">
        Please enter admin password
      </Typography>
    );
  }
}

// this makes one box for typing
function InputSlot({ index }: { index: number }) {
  return <InputOTPSlot index={ index } className="h-12 w-12 border-gray-300 pb-[4px] text-2xl" />;
}
