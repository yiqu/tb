'use client';

import RowStack from '@/shared/components/RowStack';
import { useClientOnly } from '@/hooks/useClientOnly';
import NavHeaderLogo from '@/components/side-nav/header/NavHeaderLogo';
import MetallicPaint from '@/components/reactbits/Animations/MetallicPaint/MetallicPaint';

export default function ConsentTitleLogoAnimated({ hideAnimate }: { hideAnimate?: boolean }) {
  const isClient = useClientOnly();

  if (hideAnimate || !isClient) {
    return <NavHeaderLogo size={ 50 } />;
  }

  return (
    <RowStack className="h-[50px] w-[50px]">
      <MetallicPaint
        imageSrc="/images/education.svg"
        // Pattern
        seed={ 42 }
        scale={ 4 }
        patternSharpness={ 1 }
        noiseScale={ 0.5 }
        // Animation
        speed={ 0.15 }
        liquid={ 0.75 }
        mouseAnimation={ false }
        // Visual
        brightness={ 2 }
        contrast={ 0.5 }
        refraction={ 0.01 }
        blur={ 0.015 }
        chromaticSpread={ 2 }
        fresnel={ 1 }
        angle={ 0 }
        waveAmplitude={ 1 }
        distortion={ 1 }
        contour={ 0.2 }
        // Colors
        lightColor="#ffffff"
        darkColor="#000000"
        tintColor="#9d0a0e"
      />
    </RowStack>
  );
}
