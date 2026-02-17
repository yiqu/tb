/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

export interface GridItem {
  /** Unique identifier */
  id: string | number;
  /** Image source URL */
  image: string;
  /** Data identifier for grouping/categorization */
  dataId?: string | number;
  /** Alt text for image */
  alt?: string;
}

export interface DraggableGridProps {
  /** Array of items to display in the grid */
  items: GridItem[];
  /** Number of columns in the grid */
  columns?: number;
  /** Enable drag functionality */
  enableDrag?: boolean;
  /** Enable mouse wheel scrolling */
  enableWheel?: boolean;
  /** Edge resistance when dragging (0-1) */
  edgeResistance?: number;
  /** Intro animation duration in seconds */
  introDuration?: number;
  /** Callback when an item is clicked */
  onItemClick?: (_item: GridItem, _index: number) => void;
  /** Additional CSS classes for the main container */
  className?: string;
  /** Additional CSS classes for grid container */
  gridClassName?: string;
  /** Additional CSS classes for individual items */
  itemClassName?: string;
  /** Bounds padding in pixels */
  boundsPadding?: { x: number; y: number };
  /** Container mode - 'fixed' for full viewport, 'absolute' for contained */
  containerMode?: 'fixed' | 'absolute';
  /** Scale factor for the entire grid (0.5 = half size, 2 = double size) */
  scale?: number;
  /** Gap between items in vw units */
  gap?: number;
  /** Wheel scroll smoothing duration in seconds (0.1-1.0) */
  wheelSmoothing?: number;
  /** Offset from the computed center position on startup (in pixels). Negative x shifts left, positive x shifts right. */
  initialOffset?: { x?: number; y?: number };
}

const DraggableGrid: React.FC<DraggableGridProps> = ({
  items,
  columns = 10,
  enableDrag = true,
  enableWheel = true,
  edgeResistance = 0.9,
  introDuration = 1.2,
  onItemClick,
  className = '',
  gridClassName = '',
  itemClassName = '',
  boundsPadding = { x: 200, y: 100 },
  containerMode = 'absolute',
  scale = 1,
  gap = 5,
  wheelSmoothing = 0.3,
  initialOffset = { x: 0, y: 0 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const draggableInstanceRef = useRef<Draggable | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasInitializedRef = useRef(false);

  const columnedItems = React.useMemo(() => {
    const cols: GridItem[][] = Array.from({ length: columns }, () => []);
    for (const [index, item] of items.entries()) {
      cols[index % columns].push(item);
    }
    return cols;
  }, [items, columns]);

  const getContainerDimensions = useCallback(() => {
    if (containerMode === 'fixed') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    } else {
      return {
        width: containerRef.current?.offsetWidth || window.innerWidth,
        height: containerRef.current?.offsetHeight || window.innerHeight,
      };
    }
  }, [containerMode]);

  const setupDraggable = () => {
    if (!gridRef.current || !enableDrag) return;

    const gridWidth = gridRef.current.offsetWidth;
    const gridHeight = gridRef.current.offsetHeight;
    const { width: containerWidth, height: containerHeight } = getContainerDimensions();

    const instances = Draggable.create(gridRef.current, {
      type: 'x,y',
      bounds: {
        minX: -(gridWidth - containerWidth) - boundsPadding.x,
        maxX: boundsPadding.x,
        minY: -(gridHeight - containerHeight) - boundsPadding.y,
        maxY: boundsPadding.y,
      },
      inertia: true,
      allowEventDefault: true,
      edgeResistance,
      onDragStart: () => {
        setIsDragging(true);
      },
      onDragEnd: () => {
        setIsDragging(false);
      },
    });

    draggableInstanceRef.current = instances[0];
  };

  const setupObserver = () => {
    if (!gridRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            });
          } else {
            gsap.to(entry.target, {
              opacity: 0,
              scale: 0.5,
              duration: 0.5,
              ease: 'power2.in',
            });
          }
        }
      },
      {
        root: containerMode === 'absolute' ? containerRef.current : null,
        threshold: 0.1,
      },
    );

    const productDivs = gridRef.current.querySelectorAll('.product > div');
    for (const div of productDivs) {
      observerRef.current?.observe(div);
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current || !gridRef.current || hasInitializedRef.current) return;

      requestAnimationFrame(() => {
        if (!containerRef.current || !gridRef.current) return;

        hasInitializedRef.current = true;

        const productDivs = gridRef.current.querySelectorAll('.product > div');

        if (productDivs.length === 0) return;

        const gridWidth = gridRef.current.offsetWidth;
        const gridHeight = gridRef.current.offsetHeight;
        const { width: containerWidth, height: containerHeight } = getContainerDimensions();

        const centerX = (containerWidth - gridWidth) / 2 + (initialOffset.x ?? 0);
        const centerY = (containerHeight - gridHeight) / 2 + (initialOffset.y ?? 0);

        gsap.set(gridRef.current, { x: centerX, y: centerY });

        const timeline = gsap.timeline();

        timeline.set(containerRef.current, { scale: 1.5 });
        timeline.set(productDivs, {
          scale: 1,
          opacity: 0,
        });

        timeline.to(productDivs, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: {
            amount: introDuration,
            from: 'random',
          },
        });

        timeline.to(containerRef.current, {
          scale: 1,
          duration: introDuration,
          ease: 'power3.inOut',
          onComplete: () => {
            setupDraggable();
            setupObserver();
            setIsLoaded(true);
          },
        });
      });
    },
    { scope: containerRef, dependencies: [items.length] },
  );

  useEffect(() => {
    if (!isLoaded) return;

    const updateBounds = () => {
      if (!draggableInstanceRef.current || !gridRef.current) return;

      const gridWidth = gridRef.current.offsetWidth;
      const gridHeight = gridRef.current.offsetHeight;
      const { width: containerWidth, height: containerHeight } = getContainerDimensions();

      draggableInstanceRef.current.vars.bounds = {
        minX: -(gridWidth - containerWidth) - boundsPadding.x,
        maxX: boundsPadding.x,
        minY: -(gridHeight - containerHeight) - boundsPadding.y,
        maxY: boundsPadding.y,
      };
    };

    window.addEventListener('resize', updateBounds);
    return () => {
      window.removeEventListener('resize', updateBounds);
    };
  }, [isLoaded, boundsPadding, containerMode, getContainerDimensions]);

  useEffect(() => {
    if (!enableWheel || !containerRef.current || !isLoaded) return;

    const container = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!gridRef.current || !draggableInstanceRef.current) return;

      const deltaX = -e.deltaX * 7;
      const deltaY = -e.deltaY * 7;

      const currentX = gsap.getProperty(gridRef.current, 'x') as number;
      const currentY = gsap.getProperty(gridRef.current, 'y') as number;

      const newX = currentX + deltaX;
      const newY = currentY + deltaY;

      const bounds = draggableInstanceRef.current.vars.bounds as {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
      };

      const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
      const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

      const canScrollX = (deltaX > 0 && currentX < bounds.maxX) || (deltaX < 0 && currentX > bounds.minX);
      const canScrollY = (deltaY > 0 && currentY < bounds.maxY) || (deltaY < 0 && currentY > bounds.minY);

      if (canScrollX || canScrollY) {
        e.preventDefault();
      } else {
        return;
      }

      gsap.to(gridRef.current, {
        x: clampedX,
        y: clampedY,
        duration: wheelSmoothing,
        ease: 'power3.out',
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [enableWheel, isLoaded, wheelSmoothing]);

  useEffect(() => {
    return () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleItemClick = (item: GridItem, index: number, e: React.MouseEvent) => {
    if (isDragging) return;
    e.stopPropagation();

    const target = (e.currentTarget as HTMLElement).querySelector('.product > div');
    if (target) {
      gsap.killTweensOf(target);
      const tl = gsap.timeline();

      if (Math.random() < 0.5) {
        // Wiggle animation
        tl.to(target, {
          y: -80,
          rotation: -25,
          scale: 1.3,
          duration: 0.3,
          ease: 'power3.out',
        })
          .to(target, {
            y: 20,
            rotation: 30,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.inOut',
          })
          .to(target, {
            y: -50,
            rotation: -20,
            scale: 1.25,
            duration: 0.3,
            ease: 'power2.inOut',
          })
          .to(target, {
            y: 15,
            rotation: 15,
            scale: 1.08,
            duration: 0.25,
            ease: 'power2.inOut',
          })
          .to(target, {
            y: -25,
            rotation: -10,
            scale: 1.12,
            duration: 0.25,
            ease: 'power2.inOut',
          })
          .to(target, {
            y: 8,
            rotation: 5,
            scale: 1.03,
            duration: 0.2,
            ease: 'power2.inOut',
          })
          .to(target, {
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1.2, 0.4)',
          });
      } else {
        // Jump up and down animation
        tl.to(target, {
          y: -120,
          scale: 1.2,
          duration: 0.3,
          ease: 'power3.out',
        })
          .to(target, {
            y: 0,
            scale: 0.9,
            duration: 0.25,
            ease: 'power3.in',
          })
          .to(target, {
            y: -70,
            scale: 1.15,
            duration: 0.25,
            ease: 'power2.out',
          })
          .to(target, {
            y: 0,
            scale: 0.92,
            duration: 0.2,
            ease: 'power3.in',
          })
          .to(target, {
            y: -35,
            scale: 1.08,
            duration: 0.2,
            ease: 'power2.out',
          })
          .to(target, {
            y: 0,
            scale: 0.95,
            duration: 0.18,
            ease: 'power2.in',
          })
          .to(target, {
            y: -12,
            scale: 1.03,
            duration: 0.15,
            ease: 'power2.out',
          })
          .to(target, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.5)',
          });
      }
    }

    onItemClick?.(item, index);
  };

  const itemSize = `${18.5 * scale}vw`;
  const gapSize = `${gap * scale}vw`;
  const columnOffset = `${gap * 2 * scale}vw`;

  return (
    <div
      ref={ containerRef }
      className={ cn(
        containerMode === 'fixed' ? 'fixed inset-0 h-screen w-screen' : 'absolute inset-0 h-full w-full',
        'origin-center overflow-hidden will-change-transform',
        className,
      ) }
    >
      <div
        ref={ gridRef }
        className={ cn(
          'absolute flex h-max w-max will-change-transform',
          isLoaded && enableDrag && !isDragging && 'cursor-grab',
          isDragging && 'cursor-grabbing',
          gridClassName,
        ) }
        style={ { columnGap: gapSize } }
      >
        { columnedItems.map((column, colIndex) => (
          <div
            key={ colIndex }
            className="flex flex-col"
            style={ {
              rowGap: gapSize,
              marginTop: colIndex % 2 === 1 ? columnOffset : '0',
            } }
          >
            { column.map((item, itemIndex) => {
              const globalIndex = colIndex + itemIndex * columns;
              return (
                <div
                  key={ item.id }
                  className={ cn('product relative aspect-square', itemClassName) }
                  style={ { width: itemSize } }
                  onClick={ (e) => handleItemClick(item, globalIndex, e) }
                >
                  <div className="aspect-square will-change-transform" style={ { width: itemSize } } data-id={ item.dataId }>
                    <img
                      src={ item.image }
                      alt={ item.alt || `Item ${item.id}` }
                      className="absolute h-full w-full object-cover transition-transform duration-300 ease-in-out will-change-transform hover:scale-105"
                      draggable={ false }
                    />
                  </div>
                </div>
              );
            }) }
          </div>
        )) }
      </div>
    </div>
  );
};

export default DraggableGrid;

