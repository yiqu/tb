/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import * as React from 'react';
import { motion, HTMLMotionProps, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';

type GradientBackgroundProps = HTMLMotionProps<'div'> & {
  transition?: Transition;
  colors?: string[];
};

function GradientBackground({
  className,
  transition = { duration: 15, ease: 'easeInOut', repeat: Infinity },
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'], // Default: blue-500, purple-500, pink-500
  ...props
}: GradientBackgroundProps) {
  // Generate CSS gradient string from colors array
  const generateGradient = (colorList: string[]) => {
    if (colorList.length === 1) {
      return `linear-gradient(to bottom right, ${colorList[0]}, ${colorList[0]})`;
    }
    if (colorList.length === 2) {
      return `linear-gradient(to bottom right, ${colorList[0]}, ${colorList[1]})`;
    }
    // For 3 or more colors, use first as 'from', middle colors as 'via', and last as 'to'
    const [first, ...middle] = colorList.slice(0, -1);
    const last = colorList[colorList.length - 1];
    const middleStops = middle.map((color, index) => {
      const position = ((index + 1) / (colorList.length - 1)) * 100;
      return `${color} ${position}%`;
    }).join(', ');
    
    return `linear-gradient(to bottom right, ${first}, ${middleStops ? middleStops + ', ' : ''}${last})`;
  };

  return (
    <motion.div
      data-slot="gradient-background"
      className={ cn(`size-full bg-[length:400%_400%]`, className) }
      style={ {
        background: generateGradient(colors),
      } }
      animate={ {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } }
      transition={ transition }
      { ...props }
    />
  );
}

export { GradientBackground, type GradientBackgroundProps };
