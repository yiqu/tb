/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { ArrowRight } from 'lucide-react';
import { useTheme, UseThemeProps } from 'next-themes';

import { cn } from '@/lib/utils';
import { geistFont } from '@/lib/fonts-config';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import MetaBalls from '@/components/reactbits/Animations/MetaBalls/MetaBalls';
import { GradientOgBackground } from '@/components/animate-ui/backgrounds/gradient-og';

import { AnimatedWrapper } from './AnimatedWrapper';

export function FooterSectionSection() {
  const { theme }: UseThemeProps = useTheme();
  return (
    <GradientOgBackground
      className={ cn(`py-20 md:py-32 ${geistFont.className}`, {
        'from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]': theme === 'light',
        'from-[#1e3a8a] via-[#4c1d95] to-[#9d174d]': theme === 'dark',
      }) }
    >
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <AnimatedWrapper direction="left">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className={ `mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl` }>Hatch Into the DINO-terface</h2>
            <p className="mb-8 text-xl opacity-90">
              Our UI is the gateway to everything KQPRO offers — powerful features wrapped in an intuitive design. Step in and see
              how easily you can bring it all together.
            </p>
            <div className={ `flex flex-col gap-4 sm:flex-row sm:justify-center` }>
              <ShimmerButton shimmerColor={ '#008837' } shimmerSize="0.25em">
                <SparklesText className="text-2xl" sparklesCount={ 3 }>
                  <span className="font-semibold dark:text-white">Explore KQPRO UI</span>
                </SparklesText>
                <ArrowRight className="ml-2 h-5 w-5 dark:text-white" />
              </ShimmerButton>
            </div>
            <p className="mt-6 text-sm opacity-75">
              Our UI is still evolving; at this stage, it includes only the features achieved in the current milestones.
            </p>
          </div>
        </AnimatedWrapper>
      </div>
      <div className="mt-10 flex flex-row items-center justify-center">
        <div className="flex h-[20rem] w-[20rem] flex-col items-center justify-center">
          <MetaBalls
            color="#b380ff"
            cursorBallColor="#a366ff"
            cursorBallSize={ 2.5 }
            ballCount={ 15 }
            animationSize={ 50 }
            enableMouseInteraction={ true }
            enableTransparency={ true }
            hoverSmoothness={ 0.05 }
            clumpFactor={ 1 }
            speed={ 0.4 }
          />
        </div>
      </div>
    </GradientOgBackground>
  );
}
