'use client';

import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { SquareArrowDown } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import Typography from '@/components/typography/Typography';
import { AuroraText } from '@/components/magicui/aurora-text';

export default function ProceedDashboard() {
  const nav = useRouter();
  useHotkeys('enter', () => {
    confetti({
      particleCount: 150,
    });
    nav.push('/');
  });

  return (
    <div
      className={ `z-2 mb-[5rem] flex w-full flex-row items-center justify-center gap-x-4 rounded-4xl bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-4` }
    >
      <SquareArrowDown className="z-2 -mb-2 h-[4rem] w-[4rem] animate-bounce text-background" />
      <Typography variant="body1" className="font-fun z-2 text-[2rem] font-bold text-background">
        Press{ ' ' }
        <span className="rounded-lg bg-amber-700/100 px-2 py-1 font-bold text-background">
          <AuroraText speed={ 2 } colors={ ['#d9b3ff', '#ff66a3', '#FFBE7B'] }>
            ENTER
          </AuroraText>
        </span>{ ' ' }
        to proceed to the dashboard
      </Typography>
    </div>
  );
}
