'use client';

import confetti from 'canvas-confetti';
import { useState, startTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Handshake, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { appName } from '@/constants/constants';
import { CardFooter } from '@/components/ui/card';
import Typography from '@/components/typography/Typography';
import { acceptConsent, declineConsent } from '@/server/consent/consent.server';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';

export default function ConsentCardFooter() {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');

  const handleOnDecline = async () => {
    setIsDeclining(true);
    await declineConsent();
  };

  const handleOnAccept = () => {
    setIsAccepting(true);
    confetti({ particleCount: 150 });
    startTransition(async () => {
      await acceptConsent(redirectUrl);
    });
  };

  return (
    <CardFooter className="flex justify-between">
      { isAccepting || isDeclining ?
        <div></div>
      : <Button variant="outline" onClick={ handleOnDecline } className="bg-card" disabled={ isAccepting || isDeclining }>
        Decline
      </Button>
      }
      { isAccepting || isDeclining ?
        <div className="flex h-9 flex-row items-center justify-start gap-x-2">
          <LoaderCircle size={ 18 } className="animate-spin" />
          <Typography>Redirecting you to { isDeclining ? 'home page' : appName }</Typography>
        </div>
      : <InteractiveHoverButton
          onClick={ handleOnAccept }
          className="bg-primary text-sm text-background"
          dotClassName="bg-card"
          postAnimationClassName="text-foreground "
          postAnimationIcon={ <Handshake size={ 18 } /> }
          disabled={ isAccepting }
          postAnimationText="Continue"
        >
        Accept
      </InteractiveHoverButton>
      }
    </CardFooter>
  );
}
