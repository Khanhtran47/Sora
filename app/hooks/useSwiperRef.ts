import * as React from 'react';

const useSwiperRef = <T extends HTMLElement>(): [T | undefined, React.Ref<T>] => {
  const [wrapper, setWrapper] = React.useState<T>();
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (ref.current) {
      setWrapper(ref.current);
    }
  }, []);

  return [wrapper, ref];
};

export default useSwiperRef;
