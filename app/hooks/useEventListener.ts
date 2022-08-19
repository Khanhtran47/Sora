import { useEffect, useRef } from 'react';

/**
 * It returns a function that adds an event listener to the element passed in, and removes the event
 * listener when the component unmounts
 * @param eventType - The event type to listen for.
 * @param callback - The function to be called when the event is fired.
 * @param element - The element to listen to the event on. Defaults to window.
 */
export default function useEventListener(eventType, callback, element = window) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}
