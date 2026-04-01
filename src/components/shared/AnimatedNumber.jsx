import { useState, useEffect, useRef } from 'react';

export default function AnimatedNumber({ value, duration = 1000, prefix = '', suffix = '', decimals = 2 }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const startValue = prevValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(display));

  return (
    <span className="animated-number">
      {prefix}{display < 0 ? '-' : ''}{formatted}{suffix}
    </span>
  );
}
