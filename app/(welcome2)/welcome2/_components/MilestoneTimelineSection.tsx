/* eslint-disable react/no-array-index-key */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
/* eslint-disable better-tailwindcss/enforce-consistent-class-order */

'use client';

import { useRef, useState } from 'react';
import { Brain, Users, Target, Trophy, Monitor, Terminal, Lightbulb, Handshake, Hourglass, LayoutPanelLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { geistFont } from '@/lib/fonts-config';
import { ArcTimeline, ArcTimelineItem, ArcTimelineStepClickData } from '@/components/magicui/arc-timeline';

import Fireworks from './Fireworks';
import { AnimatedWrapper } from './AnimatedWrapper';

export function MilestoneTimeLineSection() {
  const [showFireworksCount, setShowFireworksCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleOnTimelineStepClick = (stepData: ArcTimelineStepClickData) => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (stepData.step.fireworks) {
      setShowFireworksCount(4);

      // Start reducing count by 1 every 3.5 seconds after a 2-second delay to let fireworks show
      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setShowFireworksCount((prev) => {
            if (prev <= 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              return 0;
            }
            return prev - 2;
          });
        }, 3500);
      }, 2000);
    } else {
      setShowFireworksCount(0);
    }
  };

  return (
    <div className={ `min-h-[45rem] w-full ${geistFont.className} mt-16` }>
      <AnimatedWrapper direction="bottom">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className={ `mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl` }>Jurassic Journey</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track our journey through each milestone as we continue to reach goals and deliver on our vision.
          </p>
        </div>
      </AnimatedWrapper>

      <ArcTimeline
        className={ cn(
          '[--step-line-active-color:#888888] dark:[--step-line-active-color:#9780ff]',
          '[--step-line-inactive-color:#b1b1b1] dark:[--step-line-inactive-color:#737373]',
          '[--placeholder-line-color:#a1a1a1] dark:[--placeholder-line-color:#737373]',
          '[--icon-active-color:#555555] dark:[--icon-active-color:#d4d4d4]',
          '[--icon-inactive-color:#a3a3a3] dark:[--icon-inactive-color:#a3a3a3]',
          '[--time-active-color:#555555] dark:[--time-active-color:#d4d4d4]',
          '[--time-inactive-color:#a3a3a3] dark:[--time-inactive-color:#a3a3a3]',
          '[--description-color:#555555] dark:[--description-color:#d4d4d4]',
        ) }
        data={ TIMELINE }
        defaultActiveStep={ { time: '2025 Q3', stepIndex: 2 } }
        arcConfig={ {
          circleWidth: 4500,
          angleBetweenMinorSteps: 0.4,
          lineCountFillBetweenSteps: 8,
          boundaryPlaceholderLinesCount: 50,
          contentClassName: `top-[52px] ${geistFont.className}`,
        } }
        onTimelineStepClick={ handleOnTimelineStepClick }
      />
      { showFireworksCount > 0 ?
        <Fireworks population={ showFireworksCount } />
      : null }
    </div>
  );
}

const TIMELINE: ArcTimelineItem[] = [
  {
    time: '2024',
    steps: [
      {
        icon: <Lightbulb width={ 40 } height={ 40 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'INTELLIGENTNOTION Inception',
      },
      {
        icon: <Brain width={ 27 } height={ 27 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'Brainstorm sessions with the leadership.',
      },
    ],
  },
  {
    time: '2025 - Q1',
    steps: [
      {
        icon: <Users width={ 30 } height={ 30 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'Sub-teams formed to work on different aspects of the INTELLIGENTNOTION.',
      },
      {
        icon: <Target width={ 27 } height={ 27 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'Finalized INTELLIGENTNOTION milestones and goals.',
      },
    ],
  },
  {
    time: '2025 - Q2',
    steps: [
      {
        icon: <Terminal width={ 40 } height={ 40 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'INTELLIGENTNOTION development started.',
      },
    ],
  },
  {
    time: '2025 Q3',
    steps: [
      {
        icon: <Handshake width={ 27 } height={ 27 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'First request received for INTELLIGENTNOTION.',
      },
      {
        icon: <Monitor width={ 27 } height={ 27 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'Monitoring and logging system has received its first data point.',
      },
      {
        icon: <LayoutPanelLeft width={ 27 } height={ 27 } className="opacity-40 dark:opacity-70 text-green-500 dark:text-[#00cc00]" />,
        content: 'KQPRO UI v.0.1 deployed and live on TM1.',
      },
      {
        icon: <Trophy width={ 40 } height={ 40 } className="animate-bounce opacity-100 [animation-duration:1.5s] text-green-500 dark:text-[#4dff4d]" />,
        content: <span className="font-bold">Successfully reached the objectives of Milestone 1!</span>,
        fireworks: true,
      },
    ],
  },
  {
    time: '2025 Q4',
    steps: [
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
    ],
  },
  {
    time: '2026 Q1',
    steps: [
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
    ],
  },
  {
    time: '2026 Q2',
    steps: [
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
    ],
  },
  {
    time: '2026 Q3',
    steps: [
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
    ],
  },
  {
    time: '2026 Q4',
    steps: [
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
      {
        icon: <Hourglass width={ 20 } height={ 20 } color="#a6a6a6" />,
        content: 'TBD',
      },
    ],
  },
];
