import { useState, useEffect } from 'react';
import humanizeDuration from 'humanize-duration';

const ONE_YEAR_SECONDS = 31536000;
const ONE_MINUTE_MILLI = 1_000 * 1 * 60;

export default function useDuration(from: number) {
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      const currentEpoch = Date.now();
      setPassed(currentEpoch - from);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [from]);

  const hide = passed === 0 || from === 0 || passed > ONE_YEAR_SECONDS;

  return {
    duration:
      hide === true ? null
      : passed < ONE_MINUTE_MILLI ? '< a minute'
      : humanizeDuration(passed, { largest: 2, units: ['d', 'h', 'm'], round: true }),
  };
}
