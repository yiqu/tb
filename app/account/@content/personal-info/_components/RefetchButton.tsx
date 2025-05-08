'use client';

import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { revalidateUser } from '@/server/user/user.server';

export default function RefetchButton() {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleOnRefetch = () => {
    setIsDisabled(true);
    revalidateUser();

    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);
  };

  return (
    <Button variant="default" size="icon" title="Refetch" onClick={ handleOnRefetch } disabled={ isDisabled }>
      <RefreshCcw
        size={ 16 }
        className={ cn({
          'animate-spin': isDisabled,
        }) }
      />
    </Button>
  );
}
