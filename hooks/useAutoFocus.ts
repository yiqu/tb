import { useRef, useEffect } from 'react';

export default function useAutoFocus(delayTimer = 200) {
  const elementRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      elementRef.current?.focus();
    }, delayTimer);

    return () => {
      clearTimeout(timer);
    };
  });

  return {
    elementRef,
  };
}
