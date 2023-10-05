import { useEffect, useMemo } from 'react';
import { useLocation, useMatches, useParams, type UIMatch } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayout } from '~/store/layout/useLayout';

function useHeaderOptions() {
  const matches = useMatches() as UIMatch<unknown, Handle>[];
  const location = useLocation();
  const { t } = useTranslation();
  const params = useParams();
  const { backgroundColor } = useHeaderStyle((state) => state);

  const isShowMobileHeader = useMemo(
    () => !matches.some((match) => match.handle?.hideMobileHeader === true),
    [matches],
  );

  const isShowTabLink = useMemo(
    () => matches.some((match) => match.handle?.showTabLink === true),
    [matches],
  );
  const isHideSidebar = useMemo(
    () => matches.some((match) => match.handle?.hideSidebar === true),
    [matches],
  );

  const hideTabLinkWithLocation = useMemo(() => {
    const currentMatch = matches.find((match) => match.handle?.showTabLink);
    if (currentMatch?.handle?.hideTabLinkWithLocation)
      return currentMatch?.handle?.hideTabLinkWithLocation(location.pathname);
    return false;
  }, [matches, location.pathname]);

  const customHeaderBackgroundColor = useMemo(
    () => matches.some((match) => match.handle?.customHeaderBackgroundColor === true),
    [matches],
  );

  const customHeaderChangeColorOnScroll = useMemo(
    () => matches.some((match) => match.handle?.customHeaderChangeColorOnScroll === true),
    [matches],
  );

  const currentMiniTitle = useMemo(() => {
    const currentMatch = matches.filter((match) => match.handle?.miniTitle);
    if (currentMatch?.length > 0 && currentMatch?.length < 2) {
      return currentMatch[currentMatch.length - 1].handle?.miniTitle?.({
        match: currentMatch[currentMatch.length - 1],
        t, // for translations
        params,
      });
    }
    if (currentMatch?.length > 1) {
      return currentMatch[currentMatch.length - 1].handle?.miniTitle?.({
        match: currentMatch[currentMatch.length - 1],
        parentMatch: currentMatch[currentMatch.length - 2], // for titles that need from parent route
        t, // for translations
        params,
      });
    }
    return undefined;
  }, [matches, params, t]);

  const headerBackgroundColor = useMemo(() => {
    if (customHeaderBackgroundColor) {
      return backgroundColor;
    }
    return 'hsl(var(--theme-content1) / 0.6)';
  }, [customHeaderBackgroundColor, backgroundColor]);

  const isShowListViewChangeButton = useMemo(
    () => matches.some((match) => match.handle?.showListViewChangeButton === true),
    [matches],
  );

  return {
    currentMiniTitle,
    customHeaderBackgroundColor,
    customHeaderChangeColorOnScroll,
    headerBackgroundColor,
    hideTabLinkWithLocation,
    isShowListViewChangeButton,
    isShowMobileHeader,
    isShowTabLink,
    isHideSidebar,
  };
}

function useCustomHeaderChangePosition(intersection?: IntersectionObserverEntry) {
  const { viewportRef } = useLayout((state) => state);
  const { setStartChangeScrollPosition } = useHeaderStyle((state) => state);
  useEffect(() => {
    if (
      viewportRef?.current &&
      intersection?.intersectionRatio !== undefined &&
      intersection?.intersectionRatio < 1
    ) {
      if (intersection?.boundingClientRect?.top < 150) {
        setStartChangeScrollPosition(viewportRef?.current?.scrollTop - 64);
      }
    }
  }, [intersection, viewportRef, setStartChangeScrollPosition]);
}

export { useCustomHeaderChangePosition, useHeaderOptions };
