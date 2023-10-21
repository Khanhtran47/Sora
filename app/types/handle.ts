import type { SEOHandle } from '@nasa-gcn/remix-seo';
import type { Params, UIMatch } from '@remix-run/react';
import type { TFunction } from 'i18next';

export declare type Handle = {
  breadcrumb?: (options: {
    match: UIMatch<any>;
    t: TFunction<'translation', undefined>;
    params: Readonly<Params<string>>;
  }) => React.ReactNode;
  miniTitle?: (options: {
    match: UIMatch;
    parentMatch?: UIMatch;
    t: TFunction<'translation', undefined>;
    params: Readonly<Params<string>>;
  }) => {
    title: string;
    subtitle?: string;
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
  hideMobileHeader?: boolean;
} & SEOHandle;
