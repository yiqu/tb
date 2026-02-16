'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import React, { useRef, useState, useEffect } from 'react';
import { GripVertical, GripHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

export interface ComparisonSliderProps {
  /** URL for the before image (left/top) */
  beforeImage: string;
  /** URL for the after image (right/bottom) */
  afterImage: string;
  /** Alt text for the before image */
  beforeAlt?: string;
  /** Alt text for the after image */
  afterAlt?: string;
  /** Initial position of the slider (0-100) */
  initialPosition?: number;
  /** Orientation of the slider */
  orientation?: 'horizontal' | 'vertical';
  /** Enable inertia/momentum on drag */
  enableInertia?: boolean;
  /** Enable drag on hover without clicking */
  dragOnHover?: boolean;
  /** Auto-animate slider with smooth random movement */
  autoAnimate?: boolean;
  /** Width of the divider line in pixels */
  dividerWidth?: number;
  /** Show the handle with icon */
  showHandle?: boolean;
  /** Size of the handle in pixels */
  handleSize?: number;
  /** Custom icon component for the handle */
  handleIcon?: React.ReactNode;
  /** Color of the divider line */
  dividerColor?: string;
  /** Color of the handle background */
  handleColor?: string;
  /** Show before/after labels */
  showLabels?: boolean;
  /** Custom text for labels */
  labelText?: { before: string; after: string };
  /** Position of labels */
  labelPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Additional CSS classes for both labels */
  labelClassName?: string;
  /** Additional CSS classes for before label */
  beforeLabelClassName?: string;
  /** Additional CSS classes for after label */
  afterLabelClassName?: string;
  /** Show percentage indicator */
  showPercentage?: boolean;
  /** Position of percentage indicator */
  percentagePosition?: 'top' | 'bottom';
  /** Callback when drag starts */
  onDragStart?: () => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
  /** Callback when slider position changes */
  onPositionChange?: (position: number) => void;
  /** Custom ARIA label */
  ariaLabel?: string;
  /** Respect prefers-reduced-motion */
  reducedMotion?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for images */
  imageClassName?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = 'Before',
  afterAlt = 'After',
  initialPosition = 50,
  orientation = 'horizontal',
  enableInertia = true,
  dragOnHover = false,
  autoAnimate = false,
  dividerWidth = 3,
  showHandle = true,
  handleSize = 48,
  handleIcon,
  dividerColor = 'white',
  handleColor = 'white',
  showLabels = false,
  labelText = { before: 'Before', after: 'After' },
  labelPosition = 'top-left',
  labelClassName = '',
  beforeLabelClassName = '',
  afterLabelClassName = '',
  showPercentage = false,
  percentagePosition = 'top',
  onDragStart,
  onDragEnd,
  onPositionChange,
  ariaLabel = 'Image comparison slider',
  reducedMotion = false,
  className = '',
  imageClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const afterContainerRef = useRef<HTMLDivElement>(null);
  const draggableInstanceRef = useRef<Draggable | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const [isReady, setIsReady] = useState(false);
  const autoAnimationRef = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

  const isHorizontal = orientation === 'horizontal';

  const getLabelClasses = () => {
    const baseClasses = 'absolute text-sm font-medium px-3 py-1.5 rounded backdrop-blur-sm bg-black/50 text-white pointer-events-none z-10';
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };
    return `${baseClasses} ${positionClasses[labelPosition]}`;
  };

  useGSAP(
    () => {
      if (!sliderRef.current || !containerRef.current || !beforeContainerRef.current || !afterContainerRef.current) return;

      const container = containerRef.current;
      const beforeContainer = beforeContainerRef.current;
      const afterContainer = afterContainerRef.current;
      const slider = sliderRef.current;

      const containerRect = container.getBoundingClientRect();
      const initialPos = isHorizontal ? (initialPosition / 100) * containerRect.width : (initialPosition / 100) * containerRect.height;

      if (isHorizontal) {
        gsap.set(slider, { x: initialPos, y: 0, immediateRender: true });
        gsap.set(beforeContainer, {
          clipPath: `inset(0px ${containerRect.width - initialPos}px 0px 0px)`,
          immediateRender: true,
        });
        gsap.set(afterContainer, {
          clipPath: `inset(0px 0px 0px ${initialPos}px)`,
          immediateRender: true,
        });
      } else {
        gsap.set(slider, { x: 0, y: initialPos, immediateRender: true });
        gsap.set(beforeContainer, {
          clipPath: `inset(0px 0px ${containerRect.height - initialPos}px 0px)`,
          immediateRender: true,
        });
        gsap.set(afterContainer, {
          clipPath: `inset(${initialPos}px 0px 0px 0px)`,
          immediateRender: true,
        });
      }

      setIsReady(true);

      const updateClip = (value: number) => {
        const rect = container.getBoundingClientRect();
        const clampedValue = isHorizontal ? Math.max(0, Math.min(rect.width, value)) : Math.max(0, Math.min(rect.height, value));

        const percentage = isHorizontal ? (clampedValue / rect.width) * 100 : (clampedValue / rect.height) * 100;

        setCurrentPosition(percentage);

        if (isHorizontal) {
          gsap.set(beforeContainer, {
            clipPath: `inset(0px ${rect.width - clampedValue}px 0px 0px)`,
          });
          gsap.set(afterContainer, {
            clipPath: `inset(0px 0px 0px ${clampedValue}px)`,
          });
        } else {
          gsap.set(beforeContainer, {
            clipPath: `inset(0px 0px ${rect.height - clampedValue}px 0px)`,
          });
          gsap.set(afterContainer, {
            clipPath: `inset(${clampedValue}px 0px 0px 0px)`,
          });
        }

        onPositionChange?.(percentage);
      };

      const cleanupFunctions: (() => void)[] = [];

      const animateSlider = () => {
        const rect = container.getBoundingClientRect();
        const centerPos = isHorizontal ? rect.width / 2 : rect.height / 2;
        const range = 50;

        const randomOffset = (Math.random() - 0.5) * 2 * range;
        const targetPos = centerPos + randomOffset;

        const duration = 1.5 + Math.random() * 1.5;

        if (isHorizontal) {
          autoAnimationRef.current = gsap.to(slider, {
            x: targetPos,
            duration: duration,
            ease: 'power1.inOut',
            overwrite: true,
            onUpdate: () => {
              const currentX = gsap.getProperty(slider, 'x') as number;
              updateClip(currentX);
            },
            onComplete: animateSlider,
          });
        } else {
          autoAnimationRef.current = gsap.to(slider, {
            y: targetPos,
            duration: duration,
            ease: 'power1.inOut',
            overwrite: true,
            onUpdate: () => {
              const currentY = gsap.getProperty(slider, 'y') as number;
              updateClip(currentY);
            },
            onComplete: animateSlider,
          });
        }
      };

      if (autoAnimate) {
        animateSlider();

        cleanupFunctions.push(() => {
          gsap.killTweensOf(slider);
          autoAnimationRef.current = null;
        });
      }

      if (dragOnHover) {
        const handleMouseMove = (e: MouseEvent) => {
          if (autoAnimate && autoAnimationRef.current) {
            autoAnimationRef.current.kill();
            autoAnimationRef.current = null;
          }

          const rect = container.getBoundingClientRect();
          const value = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top;

          updateClip(value);

          if (isHorizontal) {
            gsap.set(slider, { x: value });
          } else {
            gsap.set(slider, { y: value });
          }
        };

        const handleMouseEnter = () => {
          setIsDragging(true);
          onDragStart?.();
          if (autoAnimate && autoAnimationRef.current) {
            autoAnimationRef.current.kill();
            autoAnimationRef.current = null;
          }
        };

        const handleMouseLeave = () => {
          setIsDragging(false);
          onDragEnd?.();
          if (autoAnimate) {
            animateSlider();
          }
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        cleanupFunctions.push(() => {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);
        });
      }

      if (!dragOnHover) {
        const instances = Draggable.create(slider, {
          type: isHorizontal ? 'x' : 'y',
          bounds: container,
          inertia: enableInertia && !shouldReduceMotion,
          onDragStart: () => {
            if (autoAnimate && autoAnimationRef.current) {
              autoAnimationRef.current.kill();
              autoAnimationRef.current = null;
            }
            setIsDragging(true);
            onDragStart?.();
          },
          onDrag: function () {
            const value = isHorizontal ? this.x : this.y;
            updateClip(value);
          },
          onDragEnd: () => {
            setIsDragging(false);
            onDragEnd?.();
            if (autoAnimate) {
              animateSlider();
            }
          },
          onThrowUpdate: function () {
            const value = isHorizontal ? this.x : this.y;
            updateClip(value);
          },
        });

        draggableInstanceRef.current = instances[0];

        cleanupFunctions.push(() => {
          if (draggableInstanceRef.current) {
            draggableInstanceRef.current.kill();
          }
        });
      }

      return () => {
        for (const cleanup of cleanupFunctions) cleanup();
      };
    },
    {
      scope: containerRef,
      dependencies: [initialPosition, orientation, enableInertia, dragOnHover, autoAnimate, beforeImage, afterImage],
    },
  );

  useEffect(() => {
    if (!draggableInstanceRef.current) return;

    const handleResize = () => {
      if (!containerRef.current || !sliderRef.current || !beforeContainerRef.current || !afterContainerRef.current) return;

      const draggable = draggableInstanceRef.current;
      if (!draggable) return;

      draggable.applyBounds(containerRef.current);

      const rect = containerRef.current.getBoundingClientRect();
      const newPos = isHorizontal ? (currentPosition / 100) * rect.width : (currentPosition / 100) * rect.height;

      if (isHorizontal) {
        gsap.set(sliderRef.current, { x: newPos });
      } else {
        gsap.set(sliderRef.current, { y: newPos });
      }

      if (isHorizontal) {
        gsap.set(beforeContainerRef.current, {
          clipPath: `inset(0px ${rect.width - newPos}px 0px 0px)`,
        });
        gsap.set(afterContainerRef.current, {
          clipPath: `inset(0px 0px 0px ${newPos}px)`,
        });
      } else {
        gsap.set(beforeContainerRef.current, {
          clipPath: `inset(0px 0px ${rect.height - newPos}px 0px)`,
        });
        gsap.set(afterContainerRef.current, {
          clipPath: `inset(${newPos}px 0px 0px 0px)`,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isHorizontal, currentPosition]);

  const defaultHandleIcon = isHorizontal ? <GripVertical className="h-4 w-4" /> : <GripHorizontal className="h-4 w-4" />;

  return (
    <div
      className={ cn('relative h-full w-full overflow-hidden rounded-lg shadow-lg', !isReady && 'opacity-0', className) }
      role="region"
      aria-label={ ariaLabel }
    >
      <div ref={ containerRef } className={ cn('relative h-full w-full overflow-hidden select-none', dragOnHover ? 'cursor-default' : '') }>
        <div ref={ beforeContainerRef } className="absolute inset-0 h-full w-full transform-gpu will-change-[clip-path]">
          <img
            src={ beforeImage }
            alt={ beforeAlt }
            className={ cn('pointer-events-none h-full w-full object-cover', imageClassName) }
            draggable={ false }
          />
          { showLabels ? <div className={ cn(getLabelClasses(), labelClassName, beforeLabelClassName) }>{ labelText.before }</div> : null }
        </div>

        <div ref={ afterContainerRef } className="absolute inset-0 h-full w-full transform-gpu will-change-[clip-path]">
          <img
            src={ afterImage }
            alt={ afterAlt }
            className={ cn('pointer-events-none h-full w-full object-cover', imageClassName) }
            draggable={ false }
          />
          { showLabels ? <div className={ cn(getLabelClasses(), labelClassName, afterLabelClassName) }>{ labelText.after }</div> : null }
        </div>

        <div
          ref={ sliderRef }
          className={ cn(
            'absolute z-10 will-change-transform',
            dragOnHover ? 'pointer-events-none cursor-crosshair'
            : autoAnimate ?
              isDragging ? 'cursor-grabbing'
              : 'cursor-grab'
            : isDragging ? 'cursor-grabbing'
            : 'cursor-grab',
            isHorizontal ? 'top-0 h-full' : 'left-0 w-full',
          ) }
        >
          <div
            className={ cn('absolute', isHorizontal ? 'top-0 left-1/2 h-full' : 'top-1/2 left-0 w-full') }
            style={ {
              [isHorizontal ? 'width' : 'height']: `${dividerWidth}px`,
              background: `linear-gradient(to top, transparent 10%, ${dividerColor} 30%, ${dividerColor} 70%, transparent 90%)`,
              transform: isHorizontal ? `translateX(-${dividerWidth / 2}px)` : `translateY(-${dividerWidth / 2}px)`,
            } }
          />

          { showHandle ? <div
              className={ cn(
                'absolute flex items-center justify-center rounded-full shadow-lg transition-transform',
                isDragging ? 'scale-110' : 'scale-100',
                'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              ) }
              style={ {
                width: `${handleSize}px`,
                height: `${handleSize}px`,
                backgroundColor: handleColor,
                boxShadow: `0 0 60px ${dividerColor}, 0 0 50px ${dividerColor}`,
                color: handleColor === '#ffffff' || handleColor === 'white' || handleColor === '#fff' ? '#000' : '#fff',
              } }
            >
            { handleIcon || defaultHandleIcon }
          </div> : null }
        </div>

        { showPercentage && percentagePosition === 'top' ? <div className="

          pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium

          text-white backdrop-blur-sm

        ">
          { Math.round(currentPosition) }%
        </div> : null }

        { showPercentage && percentagePosition === 'bottom' ? <div className="

          pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium

          text-white backdrop-blur-sm

        ">
          { Math.round(currentPosition) }%
        </div> : null }
      </div>
    </div>
  );
};

export default ComparisonSlider;

