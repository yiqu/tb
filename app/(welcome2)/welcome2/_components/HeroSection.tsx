/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useTheme, UseThemeProps } from 'next-themes';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { geistFont } from '@/lib/fonts-config';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/magicui/lens';
import { useClientOnly } from '@/hooks/useClientOnly';
import { rubik, indieFlower } from '@/lib/vibes-css-map';
import { Particles } from '@/components/magicui/particles';
import Typography from '@/components/typography/Typography';
import { AuroraText2 } from '@/components/magicui/aurora-text2';
import { MS_PALETTE, CODE_CAMP_PALETTE } from '@/lib/color-palettes';
import { GradientOgBackground } from '@/components/animate-ui/backgrounds/gradient-og';

import { APP_TITLE } from './welcome.utils';
import { AnimatedWrapper } from './AnimatedWrapper';
import { InViewPortWrapper } from './InViewPortWrapper';

const IMAGE_WIDTH = 700;

export function HeroSection() {
  const { theme }: UseThemeProps = useTheme();
  const isClient = useClientOnly();

  if (!isClient)
    return (
      <div
        className={ `relative overflow-hidden bg-gradient-to-br pt-16 pb-168 ${geistFont.className} rounded-br-4xl rounded-bl-4xl mask-b-from-99%` }
      ></div>
    );

  return (
    <>
      <GradientOgBackground
        className={ cn(
          `relative overflow-hidden bg-gradient-to-br pt-16 pb-168 ${geistFont.className} rounded-br-4xl rounded-bl-4xl mask-b-from-99%`,
          {
            'from-green-100 via-indigo-200 to-emerald-300': theme === 'light',
            'from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]': theme === 'dark',
          },
        ) }
      >
        <div className={ `container mx-auto px-4 md:px-6` }>
          <AnimatedWrapper direction="bottom" delay={ 100 }>
            <div className="mx-auto text-center">
              <InfoBadge />
              <HeroTitle3 />
              <HeroDescription />
              <ActionButtons />
            </div>
          </AnimatedWrapper>
        </div>
      </GradientOgBackground>

      <div className={ `relative mx-auto -mt-132 w-full px-4 pb-24 ${geistFont.className}` }>
        <AnimatedWrapper direction="top" delay={ 800 }>
          <HeroImage />
          <HeroImageCaption />
        </AnimatedWrapper>
      </div>
    </>
  );
}

function InfoBadge() {
  return (
    <Badge className="mb-4" variant="secondary">
      🎯 Progress: Milestone 1 completed!
    </Badge>
  );
}

function HeroTitle3() {
  const { theme }: UseThemeProps = useTheme();
  return (
    <h1 className={ `mb-6 text-9xl font-semibold tracking-normal ${rubik.className}` }>
      <AuroraText2 colors={ theme === 'light' ? MS_PALETTE : CODE_CAMP_PALETTE } speed={ 1.8 }>
        { APP_TITLE }
      </AuroraText2>
    </h1>
  );
}

function HeroDescription() {
  return (
    <p className={ `mx-auto mb-8 max-w-2xl text-lg text-pretty text-gray-600 dark:text-gray-300` }>
      This is our latest and greatest version of Notion. It&apos;s a complete rewrite of the app, with a new design, new features, and a new
      focus on productivity. This is our latest and greatest version of Notion. It&apos;s a complete rewrite of the app, with a new design,
      new features, and a new focus on productivity.
    </p>
  );
}

function ActionButtons() {
  return (
    <div className={ `flex flex-col gap-4 sm:flex-row sm:justify-center` }>
      <Button size="lg" variant="outline" className="rounded-4xl px-8 py-6 text-lg">
        The KQPRO Vision
        <ExternalLink />
      </Button>
      <Button size="lg" variant="outline" className="rounded-4xl px-8 py-6 text-lg">
        The KQPRO Vision
        <ExternalLink />
      </Button>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="relative flex flex-row items-center justify-center overflow-hidden">
      <Particles
        className="absolute inset-0 z-0 h-full w-full"
        quantity={ 100 }
        ease={ 120 }
        color={ false ? '#f6833c' : '#33cc99' }
        refresh={ false }
        staticity={ 40 }
        size={ 2 }
      />
      <Lens zoomFactor={ 3 } lensSize={ 300 } isStatic={ false }>
        <>
          <Image
            src="/welcome2/hero4.png"
            alt="dino-hero-1"
            width={ IMAGE_WIDTH }
            height={ IMAGE_WIDTH }
            priority
            data-hide-on-theme="dark"
            className="rounded-4xl mask-t-from-99% mask-r-from-98% mask-b-from-98% mask-l-from-99%"
          />

          <Image
            src="/welcome2/hero4_dark.png"
            width={ IMAGE_WIDTH }
            height={ IMAGE_WIDTH }
            alt="dino-hero-1"
            className="shrink-0"
            data-hide-on-theme="light"
            priority
          />
        </>
      </Lens>
    </div>
  );
}

function HeroImageCaption() {
  return (
    <InViewPortWrapper className={ `mt-5 mb-20 ${indieFlower.className}` }>
      <Typography className="mx-auto mt-10 mb-8 max-w-2xl text-2xl text-pretty text-gray-600 dark:text-gray-300">
        An adventure as grand as the dinosaurs of ancient times. With a team this mighty, every role matters, and together we’ll leave a
        dino-sized footprint on the future.
      </Typography>
    </InViewPortWrapper>
  );
}
