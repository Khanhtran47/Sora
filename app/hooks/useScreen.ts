import { useState } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import useEventListener from './useEventListener';

/**
 * It returns the screen object from the window object, and updates the screen object when the window
 * is resized
 * @returns The screen object.
 */
const useScreen = () => {
  const getScreen = () => {
    if (typeof window !== 'undefined' && window.screen) {
      return window.screen;
    }
    return undefined;
  };

  const [screen, setScreen] = useState<Screen | undefined>(getScreen());

  const handleSize = () => {
    setScreen(getScreen());
  };

  useEventListener('resize', handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return screen;
};

export default useScreen;
