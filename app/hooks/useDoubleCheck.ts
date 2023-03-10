/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react';

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args));
}

function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);

  function getButtonProps(props?: JSX.IntrinsicElements['button']) {
    const onBlur: JSX.IntrinsicElements['button']['onBlur'] = () => setDoubleCheck(false);

    const onClick: JSX.IntrinsicElements['button']['onClick'] = doubleCheck
      ? undefined
      : (e) => {
          e.preventDefault();
          setDoubleCheck(true);
        };

    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: callAll(onClick, props?.onClick),
    };
  }

  return { doubleCheck, getButtonProps };
}

// eslint-disable-next-line import/prefer-default-export
export { useDoubleCheck };
