import { useState, useEffect } from 'react';

/**
 * Hook to control header visibility based on scroll behavior.
 *
 * Returns `true` when:
 * - User is at or within the threshold from the top
 * - User is scrolling up
 *
 * Returns `false` when:
 * - User is scrolling down (and past the threshold)
 *
 * @param threshold - Pixel offset from top where header always stays visible (default: 0)
 * @param containerId - Optional ID of scrollable container. Uses window if not provided.
 * @returns boolean indicating whether header should be visible
 *
 * @example
 * // Basic usage with window scroll
 * const showHeader = useShowHeader()
 *
 * @example
 * // With 50px threshold before hiding kicks in
 * const showHeader = useShowHeader(50)
 *
 * @example
 * // With custom scrollable container
 * const showHeader = useShowHeader(50, 'main-content')
 *
 * <header className={showHeader ? 'translate-y-0' : '-translate-y-full'}>
 */
export function useScrollHide(threshold = 0, containerId?: string) {
  const [scrolledUpOrWithinThreshold, setScrolledUpOrWithinThreshold] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAreaScrollable, setIsAreaScrollable] = useState(false);

  useEffect(() => {
    // Get scroll target - either a specific container or window
    const container = containerId ? document.getElementById(containerId) : null;
    const target = container || window;

    // Track last scroll position to determine direction
    let lastY = container ? container.scrollTop : window.scrollY;

    const handleScroll = () => {
      const y = container ? container.scrollTop : window.scrollY;

      if (y <= threshold || y < lastY) {
        // Show header: within top threshold OR scrolling up
        setScrolledUpOrWithinThreshold(true);
      } else if (y > lastY) {
        // Hide header: scrolling down (and past threshold)
        setScrolledUpOrWithinThreshold(false);
      }

      // Track if user is at the very top
      setIsAtTop(y <= 0);

      // Track if user is at the very bottom and if the area is scrollable
      const scrollHeight = container ? container.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = container ? container.clientHeight : window.innerHeight;
      setIsAtBottom(Math.ceil(y + clientHeight) >= scrollHeight);
      setIsAreaScrollable(scrollHeight > clientHeight);

      // Update last position for next comparison
      lastY = y;
    };

    // Check initial position
    handleScroll();

    // Use passive listener for better scroll performance
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [threshold, containerId]);

  return { scrolledUpOrWithinThreshold, isAtTop, isAtBottom, isAreaScrollable };
}
