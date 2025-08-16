/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { SquareArrowDown } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import Typography from '@/components/typography/Typography';
import { AuroraText } from '@/components/magicui/aurora-text';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

export default function ProceedDashboard() {
  const nav = useRouter();
  useHotkeys('enter', () => {
    confetti({
      particleCount: 150,
    });
    nav.push('/');
  });

  return (
    <div className="z-2 w-full">
      <LayoutWithGutter size="narrow" className="z-2">
        <div
          className={ `z-2 mb-[5rem] flex w-full flex-row items-center justify-center gap-x-4 rounded-4xl bg-gradient-to-r from-amber-500/70 to-amber-700/70 px-4 py-4` }
        >
          <SquareArrowDown className="z-2 -mb-2 h-[4rem] w-[4rem] animate-bounce text-background" />
          <Typography variant="body1" className="z-2 font-fun text-[2rem] font-bold text-background">
            Press{ ' ' }
            <span className="rounded-lg bg-amber-700/100 px-2 py-1 font-bold text-background">
              <AuroraText speed={ 2 } colors={ ['#0000ff', '#ff66a3', '#009933'] }>
                <kbd>Enter</kbd>
              </AuroraText>
            </span>{ ' ' }
            to proceed
          </Typography>
        </div>
      </LayoutWithGutter>
    </div>
  );
}
