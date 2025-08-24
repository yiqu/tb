import { useState, useEffect } from 'react';

export default function useHasScrolled() {
  const [hasScrolled, setHasScrolled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.scrollY > 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    hasScrolled,
  };
}
