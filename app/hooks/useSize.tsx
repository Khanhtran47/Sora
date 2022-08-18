/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

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

export default function useSize(ref) {
  const [size, setSize] = useState({});

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return size as IUseSize;
}
