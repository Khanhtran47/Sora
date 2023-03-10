/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useMeasure, useWindowSize } from '@react-hookz/web';

import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/components/elements/scroll-area/ScrollArea';

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
        height: panelHeight,
        width: size?.width || 'auto',
      }}
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence initial={false}>
        <motion.div // slide and fade effect
          key={JSON.stringify(children, ignoreCircularReferences())}
          initial={{ x: 382, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -382, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={size?.height ? 'absolute' : 'relative'}
        >
          <ScrollArea
            type="auto"
            css={{
              height: panelHeight,
              width: size?.width || 'auto',
            }}
          >
            <ScrollAreaViewport>
              <div ref={ref} className={`w-${contentWidth}`}>
                {children}
              </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical" css={{ width: '10px !important' }}>
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
            <ScrollAreaCorner />
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ResizablePanel;
