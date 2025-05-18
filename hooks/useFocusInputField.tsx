import { useRef, useEffect } from 'react';

export default function useFocusInputField() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, []);

  return inputRef;
}
