/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useMeasure, useWindowSize } from '@react-hookz/web';
import { AnimatePresence, motion } from 'framer-motion';

import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.
  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (key.startsWith('_')) return; // Don't compare React's internal props.
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};

const ResizablePanel = ({
  children,
  contentWidth,
}: {
  children: React.ReactNode;
  contentWidth: 'full' | 'fit';
}) => {
  const [size, ref] = useMeasure<HTMLDivElement>();
  const screen = useWindowSize();
  const panelHeight = useMemo(() => {
    if (size?.height && screen?.height) {
      if ((size?.height || 0) + 10 > 400) {
        return screen?.height > 400 ? 386 : screen.height - 36;
      }
      return (size?.height || 0) + 10 > screen?.height ? screen.height - 36 : size?.height;
    }
    return 'auto';
  }, [screen?.height, size?.height]);

  return (
    <motion.div
      className="relative overflow-hidden"
      animate={{
        height: (panelHeight as number) + 16,
        width: size?.width ? size?.width + 16 : 'auto',
      }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence initial={false}>
        <motion.div // slide and fade effect
          key={JSON.stringify(children, ignoreCircularReferences())}
          initial={{ x: 382, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -382, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={size?.height ? 'absolute' : 'relative'}
        >
          <ScrollArea
            type="hover"
            style={{
              height: (panelHeight as number) + 16,
              width: size?.width ? size?.width + 16 : 'auto',
            }}
          >
            <ScrollViewport className="p-2">
              <div
                ref={ref}
                className={`${
                  contentWidth === 'fit' ? 'w-fit' : contentWidth === 'full' ? 'w-full' : ''
                }`}
              >
                {children}
              </div>
            </ScrollViewport>
            <ScrollBar />
            <ScrollCorner />
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ResizablePanel;
