import { useState, useCallback, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [targetReached, setTargetReached] = useState<boolean>(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(updateTarget);
    } else {
      matchMedia.addEventListener('change', updateTarget);
    }

    // Check on mount (callback is not called until a change occurs)
    if (matchMedia.matches) {
      setTargetReached(true);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(updateTarget);
      } else {
        matchMedia.removeEventListener('change', updateTarget);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return targetReached;
};

export default useMediaQuery;
