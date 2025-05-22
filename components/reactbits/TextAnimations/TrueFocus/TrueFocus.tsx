'use client';

import { ClassValue } from 'clsx';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  parentClassName?: HTMLAttributes<HTMLDivElement>['className'];
  textClassName?: HTMLAttributes<HTMLSpanElement>['className'];
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'True Focus',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  parentClassName = '',
  textClassName
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000,
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex!);
    }
  };

  return (
    <div
      className={cn(`relative flex flex-wrap items-center justify-center gap-4`, parentClassName)}
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            //@ts-ignore
            ref={(el) => (wordRefs.current[index] = el)}
            className={cn(`font-fun relative cursor-pointer tracking-wider`, textClassName)}
            style={
              {
                filter:
                  manualMode ?
                    isActive ? `blur(0px)`
                    : `blur(${blurAmount}px)`
                  : isActive ? `blur(0px)`
                  : `blur(${blurAmount}px)`,
                transition: `filter ${animationDuration}s ease`,
              } as React.CSSProperties
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className={`pointer-events-none absolute top-0 left-0 box-border border-0`}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={
          {
            '--border-color': borderColor,
            '--glow-color': glowColor,
          } as React.CSSProperties
        }
      >
        <span
          className={`absolute top-[-2px] left-[-5px] size-4 rounded-[3px] border-[3px] border-r-0 border-b-0`}
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
        <span
          className={`absolute top-[-2px] right-[-5px] size-4 rounded-[3px] border-[3px] border-b-0 border-l-0`}
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
        <span
          className={`absolute bottom-[-2px] left-[-5px] size-4 rounded-[3px] border-[3px] border-t-0 border-r-0`}
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
        <span
          className={`absolute right-[-2px] bottom-[-5px] size-4 rounded-[3px] border-[3px] border-t-0 border-l-0`}
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
