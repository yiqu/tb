/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';

import { rubik } from '@/lib/vibes-css-map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/magicui/lens';
import { geistFont, dinoColorFont } from '@/lib/fonts-config';
import { AuroraText2 } from '@/components/magicui/aurora-text2';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { MS_PALETTE, UNDER_CONSTRUCTION_PALETTE } from '@/lib/color-palettes';

import { APP_TITLE } from './welcome.utils';
import { AnimatedSection } from './animated-section';

const IMAGE_WIDTH = 900;

export function HeroSection() {
  return (
    <section
      className={ `relative overflow-hidden bg-gradient-to-br from-green-100 via-indigo-100 to-emerald-200 pt-8 pb-20 md:pt-16 md:pb-32 ${geistFont.className}` }
    >
      <div className={ `container mx-auto px-4 md:px-6` }>
        <AnimatedSection direction="bottom" delay={ 100 }>
          <div className="mx-auto text-center">
            <InfoBadge />
            <HeroTitle3 />
            <HeroDescription />
            <ActionButtons />
          </div>
        </AnimatedSection>
      </div>

      <div className={ `mx-auto mt-16 w-full px-4 md:px-6` }>
        <AnimatedSection direction="top" delay={ 800 }>
          <HeroImage />
        </AnimatedSection>
      </div>
    </section>
  );
}

function InfoBadge() {
  return (
    <Badge className="mb-4" variant="secondary">
      🎯 Progress: Milestone 1 completed!
    </Badge>
  );
}

function HeroTitle() {
  return (
    <h1 className={ `mb-6 text-4xl font-bold tracking-tight lg:text-7xl sm:text-5xl md:text-6xl` }>
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TALENTED</span>NOTION
    </h1>
  );
}

function HeroTitle2() {
  return (
    <h1 className={ `mb-6 text-9xl tracking-widest ${dinoColorFont.className}` }>
      <AuroraText2 colors={ UNDER_CONSTRUCTION_PALETTE }>TALENTEDNOTION</AuroraText2>
    </h1>
  );
}

function HeroTitle3() {
  return (
    <h1 className={ `mb-6 text-9xl font-semibold tracking-normal ${rubik.className}` }>
      <AuroraText2 colors={ MS_PALETTE } speed={ 1.8 }>
        { APP_TITLE }
      </AuroraText2>
    </h1>
  );
}

function HeroDescription() {
  return (
    <p className={ `mx-auto mb-8 max-w-2xl text-lg text-pretty text-gray-600` }>
      This is our latest and greatest version of Notion. It&apos;s a complete rewrite of the app, with a new design, new features, and a new
      focus on productivity. This is our latest and greatest version of Notion. It&apos;s a complete rewrite of the app, with a new design,
      new features, and a new focus on productivity.
    </p>
  );
}

function HeroDescription2() {
  return (
    <div className={ `mx-auto max-w-2xl text-lg text-pretty text-gray-600` }>
      <TypingAnimation duration={ 20 }>
        This is our latest and greatest version of Notion. It&apos;s a complete rewrite of the app, with a new design, new features, and a
        new focus on productivity. This is our latest and greatest version of Notion. It&apos;s a complete rewrite of the app, with a new
        design, new features, and a new focus on productivity.
      </TypingAnimation>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className={ `flex flex-col gap-4 sm:flex-row sm:justify-center` }>
      <ShimmerButton shimmerColor={ '#008837' } shimmerSize="0.25em">
        Explore DINO UI
        <ArrowRight className="ml-2 h-5 w-5" />
      </ShimmerButton>
      <Button size="lg" variant="outline" className="rounded-4xl px-8 py-6 text-lg">
        The DINO Vision
        <ExternalLink />
      </Button>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <Lens zoomFactor={ 3 } lensSize={ 300 } isStatic={ false }>
        <Image
          src="/welcome2/hero4.png"
          alt="dino-hero-1"
          width={ IMAGE_WIDTH }
          height={ IMAGE_WIDTH }
          priority
          className="rounded-4xl mask-t-from-98% mask-r-from-98% mask-b-from-98% mask-l-from-96%"
        />
      </Lens>
    </div>
  );
}
