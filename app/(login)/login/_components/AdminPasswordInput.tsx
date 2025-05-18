/* eslint-disable no-unused-vars */
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';

import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import useFocusInputField from '@/hooks/useFocusInputField';
import { triggerPasswordCorrect } from '@/server/admin/admin.server';
import { InputOTP, InputOTPSlot, InputOTPGroup } from '@/components/ui/input-otp';

import LoginGreetUser from './LoginGreetUser';

interface AdminPasswordInputProps {
  onPasswordEnteredStatus: (correct: boolean | null) => void;
  user: UserProfile | null;
}

export default function AdminPasswordInput({ onPasswordEnteredStatus, user }: AdminPasswordInputProps) {
  const [value, setValue] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | null>(null);
  const [isPasswordFinished, setIsPasswordFinished] = useState<boolean>(false);
  const autoFocusInputRef = useFocusInputField();

  const handleOnInputChange = useCallback(
    (value: string) => {
      setValue(value);

      if (value.length > 3) {
        setIsPasswordFinished(true);
        if (process.env.NEXT_PUBLIC_ADMIN_PASSWORD === value) {
          setIsPasswordCorrect(true);
          onPasswordEnteredStatus(true);
          triggerPasswordCorrect();
        } else {
          setIsPasswordCorrect(false);
          onPasswordEnteredStatus(false);
        }
      } else {
        setIsPasswordFinished(false);
        onPasswordEnteredStatus(null);
        setIsPasswordCorrect(null);
      }
    },
    [onPasswordEnteredStatus],
  );

  return (
    <div className="fixed z-2 flex flex-col gap-y-4 bg-black/30 text-white">
      { isPasswordCorrect === true ? null : (
        <div className="flex flex-row justify-center">
          <LoginGreetUser user={ user } isPasswordCorrect={ isPasswordCorrect } />
        </div>
      ) }

      <div className="flex flex-row justify-center">
        <PasswordStatusMessage isPasswordCorrect={ isPasswordCorrect } isPasswordFinished={ isPasswordFinished } />
      </div>

      <InputOTP
        maxLength={ 6 }
        value={ value }
        onChange={ handleOnInputChange }
        className="bg-black text-white"
        ref={ autoFocusInputRef }
        spellCheck={ false }
      >
        <InputOTPGroup className="flex w-full flex-row justify-center font-cherry-bomb-one" spellCheck={ false }>
          <InputSlot index={ 0 } />
          <InputSlot index={ 1 } />
          <InputSlot index={ 2 } />
          <InputSlot index={ 3 } />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex flex-row justify-center">
        <Typography variant="body0">
          <Link href="/">Go back home</Link>
        </Typography>
      </div>
    </div>
  );
}

function PasswordStatusMessage({
  isPasswordCorrect,
  isPasswordFinished,
}: {
  isPasswordCorrect: boolean | null;
  isPasswordFinished: boolean;
}) {
  if (isPasswordFinished) {
    if (isPasswordCorrect) {
      return (
        <Typography
          variant="h5"
          className="flex flex-row items-center gap-2 font-cherry-bomb-one text-2xl tracking-wider text-green-400"
        >
          Redirecting you to the admin dashboard...
        </Typography>
      );
    } else {
      return (
        <Typography
          variant="h5"
          className="flex flex-row items-center gap-2 font-cherry-bomb-one text-2xl tracking-wider text-destructive"
        >
          Try again
        </Typography>
      );
    }
  } else {
    return (
      <Typography variant="h5" className="font-cherry-bomb-one text-2xl tracking-wider text-green-200">
        Please enter admin password
      </Typography>
    );
  }
}

function InputSlot({ index }: { index: number }) {
  return <InputOTPSlot index={ index } className="h-12 w-12 border-gray-300 pb-[4px] text-2xl" />;
}
