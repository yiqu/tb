'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useScrollHide } from '@/hooks/useScrollHide';

type HideAnimation = 'fade' | 'slideUp';

interface ContentStickyByScrollWrapperProps {
  children: ReactNode;
  /** Pixel distance from top within which the bar always stays visible (default 50). */
  threshold?: number;
  /** ID of the scrollable container to track. Falls back to `window` when omitted. */
  containerId?: string;
  /** Extra classes merged last — can override any computed styles. */
  className?: string;
  /** Classes applied to the sticky bar in its base state (merged before visibility classes). */
  stickyClassName?: string;
  /** Hide strategy: `'fade'` (opacity only) or `'slideUp'` (opacity + vertical translate). */
  hideAnimation?: HideAnimation;
}

/**
 * Sticky content bar that auto-hides when the user scrolls down and
 * reappears when they scroll back up (or are near the top).
 *
 * Uses `useScrollHide` to determine scroll direction and position, then
 * applies one of two hide animations:
 *
 * - **fade** — opacity transition only (default).
 * - **slideUp** — opacity + upward translate for a slide-out effect.
 *
 * When the user has scrolled away from the top *and* the container is
 * actually scrollable, the bar gains an elevated "card" appearance
 * (background swap + subtle shadow) so it visually separates from the
 * page content beneath it.
 *
 * @example
 * // Fade-hide a filter bar inside a scrollable panel
 * <ContentStickyByScrollWrapper containerId="main-content" threshold={80}>
 *   <FilterBar />
 * </ContentStickyByScrollWrapper>
 *
 * @example
 * // Slide-up hide with extra padding
 * <ContentStickyByScrollWrapper hideAnimation="slideUp" className="px-4">
 *   <ActionRow />
 * </ContentStickyByScrollWrapper>
 */
export default function ContentStickyByScrollWrapper({
  children,
  threshold = 50,
  containerId,
  className,
  stickyClassName = '',
  hideAnimation = 'fade',
}: ContentStickyByScrollWrapperProps) {
  const { scrolledUpOrWithinThreshold, isAtTop, isAreaScrollable } = useScrollHide(threshold, containerId);

  const isFade = hideAnimation === 'fade';

  return (
    <div
      className={ cn(
        // Base: pin below the top-nav, full width, rounded, padded, 300ms transitions
        'sticky top-12 z-50 w-full rounded-md bg-background py-2 duration-300',

        // Fade: only animate opacity (300ms). SlideUp: animate all properties faster (150ms)
        isFade ? 'transition-opacity ease-out' : 'transition-all duration-150 ease-in-out',

        stickyClassName,

        // Visible state: fully opaque; slideUp resets transform to natural position.
        // Hidden state:  invisible + non-interactive; slideUp slides the bar off-screen upward.
        scrolledUpOrWithinThreshold ?
          cn('opacity-100', !isFade && 'translate-y-0')
        : cn('pointer-events-none opacity-0', !isFade && '-translate-y-4'),

        className,

        {
          // Elevated "floating card" look when the bar is visible, the user has
          // scrolled past the top, and the area has enough content to scroll.
          'bg-card px-2 shadow-[0_4px_4px_-3px_rgba(0,0,0,0.08)]': !isAtTop && isAreaScrollable && scrolledUpOrWithinThreshold,
        },
      ) }
      id={ `content-sticky-by-scroll-wrapper-${containerId}` }
    >
      { children }
    </div>
  );
}
