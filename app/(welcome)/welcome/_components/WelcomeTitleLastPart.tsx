'use client';

import { useState, useCallback } from 'react';

import VerticalCutReveal from '@/fancy/components/text/vertical-cut-reveal';

import WelcomeTextSwapper from './WelcomeTextSwapper';

export default function WelcomeTitleLastPart() {
  const [isComplete, setIsComplete] = useState(false);

  const handleOnComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  return (
    <>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={ 0.015 }
        staggerFrom="last"
        reverse={ true }
        transition={ {
          type: 'spring',
          stiffness: 100,
          damping: 21,
          delay: 1.5,
        } }
        wordLevelClassName="text-background font-fun tracking-normal text-[2rem]"
        onComplete={ handleOnComplete }
      >
        Welcome to your personal educational reimbursements tracker
      </VerticalCutReveal>

      { isComplete ?
        <WelcomeTextSwapper />
      : <div className="h-13"></div> }
    </>
  );
}
