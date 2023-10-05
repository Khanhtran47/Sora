import { useMemo } from 'react';
import { useFetchers, useNavigation, useRevalidator } from '@remix-run/react';

/**
 * This is a helper hook that returns the state of every fetcher active on
 * the app and combine it with the state of the global transition and
 * revalidator.
 * @example
 * const states = useGlobalNavigationState();
 * if (state.includes("loading")) {
 *   // The app is loading or revalidating.
 * }
 * if (state.includes("submitting")) {
 *   // The app is submitting.
 * }
 * // The app is idle
 */
export function useGlobalNavigationState() {
  const { state: navigationState } = useNavigation();
  const { state: revalidatorState } = useRevalidator();
  const fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form) and revalidator.
   */
  return useMemo(
    function getGlobalNavigationState() {
      return [
        navigationState,
        // The type cast here is used to remove RevalidatorState from the union
        revalidatorState as 'idle' | 'loading',
        ...fetchers.map((fetcher) => fetcher.state),
      ];
    },
    [navigationState, revalidatorState, fetchers],
  );
}

/**
 * const you know if the app is pending some request, either global transition
 * or some fetcher transition.
 * @returns "idle" | "pending"
 */
export function useGlobalPendingState() {
  const isSubmitting = useGlobalSubmittingState() === 'submitting';
  const isLoading = useGlobalLoadingState() === 'loading';

  if (isLoading || isSubmitting) return 'pending';
  return 'idle';
}

/**
 * const you know if the app is submitting some request, either global transition
 * or some fetcher transition.
 * @returns "idle" | "submitting"
 */
export function useGlobalSubmittingState() {
  const states = useGlobalNavigationState();
  if (states.includes('submitting')) return 'submitting';
  return 'idle';
}

/**
 * const you know if the app is loading some request, either global transition
 * or some fetcher transition.
 * @returns "idle" | "loading"
 */
export function useGlobalLoadingState() {
  const states = useGlobalNavigationState();
  if (states.includes('loading')) return 'loading';
  return 'idle';
}
