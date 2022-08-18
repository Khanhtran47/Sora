/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

/**
 * It returns a boolean value that indicates whether the element is visible on the screen or not.
 * @param ref - The ref of the element you want to observe.
 * @param [rootMargin=0px] - This is the margin around the root. It can have values similar to the CSS
 * margin property, e.g. "10px 20px 30px 40px" (top, right, bottom, left). The values can be
 * percentages. This set of values serves to grow or shrink each side of
 * @returns A boolean value.
 */
export default function useOnScreen(ref, rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current == null) return;
    const observered = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin,
    });
    observered.observe(ref.current);
    return () => {
      if (ref.current == null) return;
      observered.unobserve(ref.current);
    };
  }, [ref.current, rootMargin]);

  return isVisible;
}
