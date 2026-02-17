'use client';

import React from 'react';
import { gsap } from 'gsap';

export interface TextScatterProps {
  text?: string;
  className?: string;
  as?: React.ElementType;
  velocity?: number;
  rotation?: number;
  scale?: number;
  returnAfter?: number;
  duration?: number;
}

const TextScatter: React.FC<TextScatterProps> = ({
  text = 'Bounce Back.',
  className = '',
  as: Tag = 'h1',
  velocity = 200,
  rotation = 90,
  scale = 1,
  returnAfter = 1,
  duration = 2,
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = centerX - mouseX;
    const dy = centerY - mouseY;

    const angle = Math.atan2(dy, dx);

    const randomFactor = 0.8 + Math.random() * 0.4;
    const force = velocity * randomFactor;

    const moveX = Math.cos(angle) * force;
    const moveY = Math.sin(angle) * force;

    const rotate = (Math.random() - 0.5) * rotation * 2;

    gsap.to(target, {
      x: moveX,
      y: moveY,
      rotation: rotate,
      scale: scale,
      duration: duration,
      ease: 'power4.out',
      overwrite: 'auto',
      onComplete: () => {
        gsap.to(target, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: duration,
          delay: returnAfter,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        });
      },
    });
  };

  return React.createElement(
    Tag,
    { className: `inline-block relative select-none ${className}` },
    text.split('').map((char, index) => (
      <span
        key={ index }
        className="relative inline-block cursor-default"
        onMouseEnter={ handleMouseEnter }
        style={ { willChange: 'transform' } }
      >
        { char === ' ' ? '\u00A0' : char }
      </span>
    )),
  );
};

export default TextScatter;

