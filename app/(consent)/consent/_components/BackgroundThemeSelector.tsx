import { WEST_D_PALETTE } from '@/lib/color-palettes';
import Prism from '@/components/reactbits/Backgrounds/Prism/Prism';
import Plasma from '@/components/reactbits/Backgrounds/Plasma/Plasma';
import Galaxy from '@/components/reactbits/Backgrounds/Galaxy/Galaxy';
import DarkVeil from '@/components/reactbits/Backgrounds/DarkVeil/DarkVeil';
import LightRays from '@/components/reactbits/Backgrounds/LightRays/LightRays';
import Particles from '@/components/reactbits/Backgrounds/Particles/Particles';
import PixelBlast from '@/components/reactbits/Backgrounds/PixelBlast/PixelBlast';
import ColorBends from '@/components/reactbits/Backgrounds/ColorBends/ColorBends';
import Lightspeed from '@/components/reactbits/Backgrounds/Lightspeed/lightspeed';
import LightPillar from '@/components/reactbits/Backgrounds/LightPillar/LightPillar';
import FloatingLines from '@/components/reactbits/Backgrounds/FloatingLines/FloatingLines';
import PrismaticBurst from '@/components/reactbits/Backgrounds/PrismaticBurst/PrismaticBurst';

export default function BackgroundThemeSelector({ currentMonth }: { currentMonth: number }) {
  if (currentMonth === 1) {
    return (
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={ 1 }
        glowIntensity={ 0.3 }
        saturation={ 0 }
        hueShift={ 140 }
        twinkleIntensity={ 0.3 }
        rotationSpeed={ 0.1 }
        repulsionStrength={ 2 }
        autoCenterRepulsion={ 0 }
        starSpeed={ 0.5 }
        speed={ 1 }
      />
    );
  }
  if (currentMonth === 2) {
    return (
      <Lightspeed
        width="100%"
        height={ '100%' }
        speed={ 0.2 }
        primaryColor="#FF1744"
        secondaryColor="#00E5FF"
        tertiaryColor="#76FF03"
        intensity={ 2.2 }
      />
    );
  }
  if (currentMonth === 3) {
    return (
      <FloatingLines
        enabledWaves={ ['top', 'middle', 'bottom'] }
        lineCount={ 5 }
        lineDistance={ 5 }
        bendRadius={ 5 }
        bendStrength={ -0.5 }
        interactive={ true }
        parallax={ true }
      />
    );
  }
  if (currentMonth === 4) {
    return (
      <Prism
        animationType="rotate"
        timeScale={ 0.5 }
        height={ 3.5 }
        baseWidth={ 5.5 }
        scale={ 2.2 }
        hueShift={ 0 }
        colorFrequency={ 1 }
        noise={ 0 }
        glow={ 1 }
      />
    );
  }
  if (currentMonth === 5) {
    return <DarkVeil hueShift={ 0 } noiseIntensity={ 0 } scanlineIntensity={ 0 } speed={ 1.9 } scanlineFrequency={ 0 } warpAmount={ 0 } />;
  }
  if (currentMonth === 6) {
    return (
      <LightPillar
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={ 1 }
        rotationSpeed={ 0.3 }
        glowAmount={ 0.002 }
        pillarWidth={ 3 }
        pillarHeight={ 0.4 }
        noiseIntensity={ 0.5 }
        pillarRotation={ 25 }
        interactive={ false }
        mixBlendMode="screen"
        quality="high"
      />
    );
  }
  if (currentMonth === 7) {
    return (
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={ 1 }
        lightSpread={ 0.5 }
        rayLength={ 3 }
        followMouse={ true }
        mouseInfluence={ 0.1 }
        noiseAmount={ 0 }
        distortion={ 0 }
        className="custom-rays"
        pulsating={ false }
        fadeDistance={ 1 }
        saturation={ 1 }
      />
    );
  }
  if (currentMonth === 8) {
    return (
      <PixelBlast
        variant="square"
        pixelSize={ 4 }
        color="#B19EEF"
        patternScale={ 2 }
        patternDensity={ 1 }
        pixelSizeJitter={ 0 }
        enableRipples
        rippleSpeed={ 0.4 }
        rippleThickness={ 0.12 }
        rippleIntensityScale={ 1.5 }
        liquid={ false }
        liquidStrength={ 0.12 }
        liquidRadius={ 1.2 }
        liquidWobbleSpeed={ 5 }
        speed={ 0.5 }
        edgeFade={ 0.25 }
        transparent
      />
    );
  }
  if (currentMonth === 9) {
    return (
      <ColorBends
        colors={ ['#ff5c7a', '#8a5cff', '#00ffd1'] }
        rotation={ 0 }
        speed={ 0.2 }
        scale={ 1 }
        frequency={ 1 }
        warpStrength={ 1 }
        mouseInfluence={ 1 }
        parallax={ 0.5 }
        noise={ 0.1 }
        transparent
        autoRotate={ 0 }
      />
    );
  }
  if (currentMonth === 10) {
    return <Plasma color="#ff6b35" speed={ 0.6 } direction="forward" scale={ 1.1 } opacity={ 0.8 } mouseInteractive={ true } />;
  }
  if (currentMonth === 11) {
    return (
      <Particles
        particleColors={ ['#ffffff'] }
        particleCount={ 400 }
        particleSpread={ 6 }
        speed={ 0.1 }
        particleBaseSize={ 150 }
        moveParticlesOnHover
        alphaParticles={ false }
        disableRotation={ false }
        pixelRatio={ 1 }
      />
    );
  }
  if (currentMonth === 12) {
    return (
      <PrismaticBurst
        animationType="rotate3d"
        intensity={ 2 }
        speed={ 0.5 }
        distort={ 0 }
        paused={ false }
        offset={ { x: 0, y: 0 } }
        hoverDampness={ 0.25 }
        rayCount={ 0 }
        mixBlendMode="lighten"
        colors={ WEST_D_PALETTE }
      />
    );
  }

  return <div></div>;
}
