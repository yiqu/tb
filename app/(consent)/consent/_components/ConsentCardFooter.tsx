'use client';

import confetti from 'canvas-confetti';
import { useState, startTransition } from 'react';
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

  const handleOnDecline = async () => {
    setIsDeclining(true);
    await declineConsent();
  };

  const handleOnAccept = () => {
    setIsAccepting(true);
    confetti({ particleCount: 150 });
    startTransition(async () => {
      await acceptConsent();
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
        <div className="flex flex-row items-center justify-start gap-x-2 h-9">
          <LoaderCircle size={ 18 } className="animate-spin" />
          <Typography>Redirecting you to { isDeclining ? 'home page' : appName }</Typography>
        </div>
      : <InteractiveHoverButton
          onClick={ handleOnAccept }
          className="bg-primary text-sm text-background"
          dotClassName="bg-card"
          postAnimationClassName="text-foreground bg-gradient-to-r from-white to-green-200"
          postAnimationIcon={ <Handshake size={ 18 } /> }
          disabled={ isAccepting }
        >
        Accept and continue
      </InteractiveHoverButton>
      }
    </CardFooter>
  );
}
