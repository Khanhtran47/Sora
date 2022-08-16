/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

/**
 * It returns a boolean value that indicates whether the current window width is less than or equal to
 * the width passed in as an argument
 * @param {number} width - number - The width of the screen you want to target
 * @param {'max' | 'min'} [maxMin] - optional max-width or min-width, default is max-width
 * @param {'portrait' | 'landscape'} [orientation] - optional portrait or landscape, default is portrait
 * @returns A boolean value.
 */
const useMediaQuery = (
  width: number,
  maxMin?: 'max' | 'min',
  orientation?: 'portrait' | 'landscape',
) => {
  const [targetReached, setTargetReached] = React.useState(false);

  const updateTarget = React.useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);
  React.useEffect(() => {
    let query = '';
    if (maxMin) {
      // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
      maxMin === 'max' ? (query = 'max-width') : (query = 'min-width');
    } else {
      query = 'max-width';
    }
    const media = window.matchMedia(
      `(${query}: ${width}px) and (orientation: ${orientation || 'portrait'})`,
    );
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
};

export default useMediaQuery;
