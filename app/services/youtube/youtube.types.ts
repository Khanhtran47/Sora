export interface IYoutubeVideo {
  etag: string;
  items: Item[];
  kind: string;
  pageInfo: PageInfo;
}

export interface Item {
  contentDetails: ContentDetails;
  etag: string;
  id: string;
  kind: string;
  snippet: Snippet;
}

export interface ContentDetails {
  caption: string;
  contentRating: ContentRating;
  definition: string;
  dimension: string;
  duration: string;
  licensedContent: boolean;
  projection: string;
}

export interface ContentRating {
  acbRating: string;
  agcomRating: string;
  anatelRating: string;
  bbfcRating: string;
  bfvcRating: string;
  bmukkRating: string;
  catvRating: string;
  catvfrRating: string;
  cbfcRating: string;
  cccRating: string;
  cceRating: string;
  chfilmRating: string;
  chvrsRating: string;
  cicfRating: string;
  cnaRating: string;
  cncRating: string;
  csaRating: string;
  cscfRating: string;
  czfilmRating: string;
  djctqRating: string;
  djctqRatingReasons: string[];
  ecbmctRating: string;
  eefilmRating: string;
  egfilmRating: string;
  eirinRating: string;
  fcbmRating: string;
  fcoRating: string;
  fmocRating: string;
  fpbRating: string;
  fpbRatingReasons: string[];
  fskRating: string;
  grfilmRating: string;
  icaaRating: string;
  ifcoRating: string;
  ilfilmRating: string;
  incaaRating: string;
  kfcbRating: string;
  kijkwijzerRating: string;
  kmrbRating: string;
  lsfRating: string;
  mccaaRating: string;
  mccypRating: string;
  mcstRating: string;
  mdaRating: string;
  medietilsynetRating: string;
  mekuRating: string;
  mibacRating: string;
  mocRating: string;
  moctwRating: string;
  mpaaRating: string;
  mpaatRating: string;
  mtrcbRating: string;
  nbcRating: string;
  nbcplRating: string;
  nfrcRating: string;
  nfvcbRating: string;
  nkclvRating: string;
  oflcRating: string;
  pefilmRating: string;
  rcnofRating: string;
  resorteviolenciaRating: string;
  rtcRating: string;
  rteRating: string;
  russiaRating: string;
  skfilmRating: string;
  smaisRating: string;
  smsaRating: string;
  tvpgRating: string;
  ytRating: string;
}

export interface Snippet {
  categoryId: string;
  channelId: string;
  channelTitle: string;
  defaultAudioLanguage: string;
  description: string;
  liveBroadcastContent: string;
  localized: Localized;
  publishedAt: Date;
  tags: string[];
  thumbnails: Thumbnails;
  title: string;
}

export interface Localized {
  description: string;
  title: string;
}

export interface Thumbnails {
  default: Default;
  high: Default;
  maxres: Default;
  medium: Default;
  standard: Default;
}

export interface Default {
  height: number;
  url: string;
  width: number;
}

export interface PageInfo {
  resultsPerPage: number;
  totalResults: number;
}
