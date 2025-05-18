'use client';

import { useState } from 'react';

import { UserProfile } from '@/models/user/user.model';

import MatrixBackground from './MatrixBackground';
import AdminPasswordInput from './AdminPasswordInput';

export default function AdminPasswordInputParent({ user }: { user: UserProfile | null }) {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | null>(null);

  const onPasswordEnteredStatus = (correct: boolean | null) => {
    setIsPasswordCorrect(correct);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AdminPasswordInput onPasswordEnteredStatus={ onPasswordEnteredStatus } user={ user } />
      <MatrixBackground isWrong={ isPasswordCorrect === false } />
    </div>
  );
}
