import { useEffect, useMemo } from 'react';
import { useLocation, useMatches } from '@remix-run/react';
import { isEdgeChromium } from 'react-device-detect';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

function useHeaderOptions() {
  const matches = useMatches();
  const location = useLocation();
  const { scrollPosition } = useLayoutScrollPosition((state) => state);
  const { backgroundColor, startChangeScrollPosition } = useHeaderStyle((state) => state);

  const isShowMobileHeader = useMemo(
    () => !matches.some((match) => match.handle?.hideMobileHeader === true),
    [matches],
  );

  const isShowTabLink = useMemo(
    () => matches.some((match) => match.handle?.showTabLink === true),
    [matches],
  );

  const hideTabLinkWithLocation: boolean = useMemo(() => {
    const currentMatch = matches.find((match) => match.handle?.showTabLink);
    if (currentMatch?.handle?.hideTabLinkWithLocation)
      return currentMatch?.handle?.hideTabLinkWithLocation(location.pathname);
    return false;
  }, [matches, location.pathname]);

  const customHeaderBackgroundColor = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderBackgroundColor === true),
    [matches],
  );

  const customHeaderChangeColorOnScroll = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderChangeColorOnScroll === true),
    [matches],
  );

  const currentMiniTitle = useMemo(() => {
    const currentMatch = matches.filter((match) => match.handle?.miniTitle);
    if (currentMatch?.length > 0) {
      return currentMatch[currentMatch.length - 1].handle?.miniTitle(
        currentMatch[currentMatch.length - 1],
      );
    }
    return undefined;
  }, [matches]);

  const headerBackgroundColor = useMemo(() => {
    if (customHeaderBackgroundColor) {
      return backgroundColor;
    }
    return 'var(--nextui-colors-backgroundContrastAlpha)';
  }, [customHeaderBackgroundColor, backgroundColor]);

  const headerBackgroundOpacity = useMemo(() => {
    switch (customHeaderChangeColorOnScroll) {
      case true:
        if (startChangeScrollPosition === 0) {
          return 0;
        }
        if (
          scrollPosition.y > startChangeScrollPosition &&
          scrollPosition.y < startChangeScrollPosition + 100 &&
          scrollPosition.y > 80 &&
          startChangeScrollPosition > 0
        ) {
          return (scrollPosition.y - startChangeScrollPosition) / 100;
        }
        if (scrollPosition.y > startChangeScrollPosition + 100) {
          return 1;
        }
        return 0;
      case false:
        return scrollPosition.y < 80 ? scrollPosition.y / 80 : 1;
      default:
        return scrollPosition.y < 80 ? scrollPosition.y / 80 : 1;
    }
  }, [customHeaderChangeColorOnScroll, scrollPosition.y, startChangeScrollPosition]);

  return {
    isShowMobileHeader,
    isShowTabLink,
    hideTabLinkWithLocation,
    customHeaderBackgroundColor,
    customHeaderChangeColorOnScroll,
    currentMiniTitle,
    headerBackgroundColor,
    headerBackgroundOpacity,
  };
}

function useCustomHeaderChangePosition(intersection?: IntersectionObserverEntry) {
  const { viewportRef } = useLayoutScrollPosition((state) => state);
  const { setStartChangeScrollPosition } = useHeaderStyle((state) => state);
  useEffect(() => {
    if (
      viewportRef?.current &&
      intersection?.intersectionRatio !== undefined &&
      intersection?.intersectionRatio < 1
    ) {
      if (isEdgeChromium) {
        // smooth scrolling on edge chromium breaks the getBoundingClientRect() method here, don't know why
        setStartChangeScrollPosition(viewportRef?.current?.scrollTop);
      } else if (!isEdgeChromium && intersection?.boundingClientRect?.top < 200) {
        setStartChangeScrollPosition(viewportRef?.current?.scrollTop);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersection]);
}

export { useCustomHeaderChangePosition, useHeaderOptions };
