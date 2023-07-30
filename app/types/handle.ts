import type { SEOHandle } from '@balavishnuvj/remix-seo';
import type { Params, RouteMatch } from '@remix-run/react';
import type { TFunction } from 'i18next';

export declare type Handle = {
  breadcrumb?: (options: {
    match: RouteMatch;
    t: TFunction<'translation', undefined>;
    params: Readonly<Params<string>>;
  }) => React.ReactNode;
  miniTitle?: (options: {
    match: RouteMatch;
    parentMatch?: RouteMatch;
    t: TFunction<'translation', undefined>;
    params: Readonly<Params<string>>;
  }) => {
    title: string;
    subTitle?: string;
    showImage?: boolean;
    imageUrl?: string;
  };
  showTabLink?: boolean;
  i18n?: string;
  disableLayoutPadding?: boolean;
  tabLinkPages?:
    | ((options: { params: Readonly<Params<string>> }) => {
        pageName: string;
        pageLink: string;
      }[])
    | {
        pageName: string;
        pageLink: string;
      }[];
  tabLinkTo?: (options: { params: Readonly<Params<string>> }) => string;
  hideTabLinkWithLocation?: (locationPathname: string) => boolean;
  playerSettings?: {
    isMini?: boolean;
    shouldShowPlayer?: boolean;
  };
  preventScrollToTop?: boolean;
  customHeaderBackgroundColor?: boolean;
  customHeaderChangeColorOnScroll?: boolean;
  showListViewChangeButton?: boolean;
  hideSidebar?: boolean;
} & SEOHandle;
