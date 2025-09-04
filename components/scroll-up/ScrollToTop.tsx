'use client';

import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface ScrollToTopProps {
  onlyShowWhenScrolledUp?: boolean;
}

export function ScrollToTop({ onlyShowWhenScrolledUp = false }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when user scrolls up and is not at the top
      if (currentScrollY > 100) {
        if (onlyShowWhenScrolledUp) {
          if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY, onlyShowWhenScrolledUp]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  };

  return (
    <div
      className={ `
        fixed right-6 bottom-6 z-50 transition-all duration-300 ease-out
        ${
        isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-0 opacity-0'
      }
      ` }
    >
      <Button
        onClick={ scrollToTop }
        size="icon"
        className={ `rounded-full transition-all duration-200` }
        title="Go back to top"
        variant="default"
      >
        <ArrowUp className={ `transition-transform duration-200` } />
      </Button>
    </div>
  );
}
