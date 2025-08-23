'use client';

import { Check, Frown } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import Typography from '@/components/typography/Typography';
import { triggerPasswordCorrect } from '@/server/admin/admin.server';
import { InputOTP, InputOTPSlot, InputOTPGroup } from '@/components/ui/input-otp';

export default function AdminPasswordInput() {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
  const [isPasswordFinished, setIsPasswordFinished] = useState<boolean>(false);

  const handleOnInputChange = (value: string) => {
    setValue(value);

    if (value.length > 3) {
      setIsPasswordFinished(true);
      if (process.env.NEXT_PUBLIC_ADMIN_PASSWORD === value) {
        setIsPasswordCorrect(true);
        triggerPasswordCorrect();
      } else {
        setIsPasswordCorrect(false);
      }
    } else {
      setIsPasswordFinished(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, []);

  return (
    <div className="fixed top-[50%] left-[50%] z-2 bg-black text-white">
      <InputOTP
        maxLength={ 6 }
        value={ value }
        onChange={ handleOnInputChange }
        className="font-cherry-bomb-one bg-black text-white"
        ref={ inputRef }
        spellCheck={ false }
      >
        <InputOTPGroup className="font-cherry-bomb-one flex w-full flex-row justify-center" spellCheck={ false }>
          <InputSlot index={ 0 } />
          <InputSlot index={ 1 } />
          <InputSlot index={ 2 } />
          <InputSlot index={ 3 } />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex flex-row justify-center">
        <PasswordStatusMessage isPasswordCorrect={ isPasswordCorrect } isPasswordFinished={ isPasswordFinished } />
      </div>
    </div>
  );
}

function PasswordStatusMessage({ isPasswordCorrect, isPasswordFinished }: { isPasswordCorrect: boolean; isPasswordFinished: boolean }) {
  if (isPasswordFinished) {
    if (isPasswordCorrect) {
      return (
        <Typography variant="h5" className="font-cherry-bomb-one flex flex-row items-center gap-2 text-2xl tracking-wider text-green-400">
          Password is correct
          <Check size={ 20 } className="text-green-500" />
        </Typography>
      );
    } else {
      return (
        <Typography variant="h5" className="font-cherry-bomb-one flex flex-row items-center gap-2 text-2xl tracking-wider text-destructive">
          Password is incorrect
          <Frown size={ 26 } className="text-destructive" />
        </Typography>
      );
    }
  } else {
    return (
      <Typography variant="h5" className="font-cherry-bomb-one text-2xl tracking-wider text-green-200">
        Enter admin password
      </Typography>
    );
  }
}

function InputSlot({ index }: { index: number }) {
  return <InputOTPSlot index={ index } className="h-12 w-12 pb-[7px] text-2xl" />;
}
