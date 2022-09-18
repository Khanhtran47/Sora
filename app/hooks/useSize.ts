/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, RefObject } from 'react';

export interface IUseSize {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * It returns an object with the width and height of the element that is passed to it
 * @param ref - The ref of the element you want to observe.
 * @returns The size of the element.
 */
export default function useSize(ref: RefObject<HTMLElement>) {
  const [size, setSize] = useState({});

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return size as IUseSize;
}
