type ThrottleFunction<T extends unknown[], R> = (...args: T) => R;

function throttle<T extends unknown[], R>(
  fn: ThrottleFunction<T, R>,
  delay: number,
): ThrottleFunction<T, R> {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: T | undefined;

  return function throttledFn(...args: T): R {
    lastArgs = args;
    if (!timerId) {
      timerId = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fn(...lastArgs!);
        timerId = undefined;
        lastArgs = undefined;
      }, delay);
    }
    return {} as R;
  };
}

export { throttle };
