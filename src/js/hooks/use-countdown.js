import { useCallback, useEffect, useRef, useState } from 'react';

export default function useCountdown(done) {
  const [timeLeft, setTimeLeft] = useState(0);
  const timer = useRef({});

  const start = useCallback(time => {
    timer.current.started = true;
    timer.current.timeout = setTimeout(() => setTimeLeft(time), 100);
  }, []);
  const pause = useCallback(() => {
    timer.current.paused = true;
    clearTimeout(timer.current.timeout);
  }, []);
  const resume = useCallback(() => {
    timer.current.paused = false;
    timer.current.timeout = setTimeout(
      () => setTimeLeft(timer.current.timeLeft - 100),
      100
    );
  }, []);

  useEffect(() => {
    if (!timer.current.started || timer.current.paused) return;
    if (timeLeft <= 0) {
      done();
    } else {
      timer.current.timeLeft = timeLeft;
      timer.current.timeout = setTimeout(
        () => setTimeLeft(timeLeft - 100),
        100
      );
    }

    return () => {
      // current is not an element, so eslint warning is not valid here
      // eslint-disable-next-line
      clearTimeout(timer.current.timeout);
    };
  }, [timeLeft, done]);

  return { start, pause, resume };
}
