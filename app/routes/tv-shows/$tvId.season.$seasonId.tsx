import { useEffect, useRef } from 'react';
import { Avatar } from '@nextui-org/avatar';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { useIntersectionObserver, useMeasure, useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useCatch, useLoaderData, useParams, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';
import { motion, useTransform } from 'framer-motion';
import Vibrant from 'node-vibrant';
import { MimeType } from 'remix-image';
import { useHydrated } from 'remix-utils';

import getProviderList from '~/services/provider.server';
import { authenticate } from '~/services/supabase';
import { getTvSeasonDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayout } from '~/store/layout/useLayout';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useCustomHeaderChangePosition } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { tvSeasonDetailPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import Image from '~/components/elements/Image';
import CatchBoundaryView from '~/components/elements/shared/CatchBoundaryView';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import TabLink from '~/components/elements/tab/TabLink';
import { backgroundStyles } from '~/components/styles/primitives';
import PhotoIcon from '~/assets/icons/PhotoIcon';
import BackgroundDefault from '~/assets/images/background-default.jpg';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId, seasonId } = params;
  if (!tvId || !seasonId) throw new Error('Missing params');
  const tid = Number(tvId);
  const sid = Number(seasonId);

  // get translators

  const [seasonDetail, detail, detailEng] = await Promise.all([
    getTvSeasonDetail(tid, sid, locale),
    getTvShowDetail(tid, locale),
    getTvShowDetail(tid, 'en-US'),
  ]);
  if (!seasonDetail) throw new Response('Not Found', { status: 404 });
  const title = detailEng?.name || '';
  const orgTitle = detail?.original_name || '';
  const year = new Date(seasonDetail?.air_date || '').getFullYear();
  const season = seasonDetail?.season_number;
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(seasonDetail?.poster_path || '', 'w300'),
  )}`;
  const isEnded = detail?.status === 'Ended' || detail?.status === 'Canceled';

  const [providers, fimg] = await Promise.all([
    getProviderList({
      type: 'tv',
      title,
      orgTitle,
      year,
      season,
      animeId: undefined,
      animeType: undefined,
      isEnded,
      tmdbId: tid,
    }),
    fetch(extractColorImage),
  ]);

  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette = seasonDetail?.poster_path ? await Vibrant.from(fimgb).getPalette() : undefined;

  if (providers && providers.length > 0)
    return json(
      {
        detail,
        seasonDetail,
        providers,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      { headers: { 'Cache-Control': CACHE_CONTROL.season } },
    );

  return json(
    {
      detail,
      seasonDetail,
      color: palette
        ? Object.values(palette).sort((a, b) =>
            a?.population === undefined || b?.population === undefined
              ? 0
              : b.population - a.population,
          )[0]?.hex
        : undefined,
      providers: [],
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.season } },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Season',
      description: `This Tv show doesn't have season ${params.seasonId}`,
    };
  }
  const { detail, seasonDetail } = data;
  return {
    title: `Watch ${detail?.name || ''} ${seasonDetail?.name || ''} HD online Free - Sora`,
    description: `Watch ${detail?.name || ''} ${
      seasonDetail?.name || ''
    } in full HD online with Subtitle`,
    keywords: `Watch ${detail?.name || ''}, Stream ${detail?.name || ''}, Watch ${
      detail?.name || ''
    } HD, Online ${detail?.name || ''}, Streaming ${detail?.name || ''}, English, Subtitle ${
      detail?.name || ''
    }, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}`,
    'og:title': `Watch ${detail?.name || ''} ${seasonDetail?.name || ''} HD online Free - Sora`,
    'og:description': `Watch ${detail?.name || ''} ${
      seasonDetail?.name || ''
    } in full HD online with Subtitle`,
    'og:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.tvId}&mt=tv`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <BreadcrumbItem
        to={`/tv-shows/${match.params.tvId}/`}
        key={`tv-show-${match.params.tvId}-overview`}
      >
        {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}`}
        key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}`}
      >
        Season {match.params.seasonId}
      </BreadcrumbItem>
    </>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: `${match.data?.detail?.name || match.data?.detail?.original_name} - ${
      match.data?.seasonDetail?.name
    }`,
    subtitle: 'Episodes',
    showImage: match.data?.seasonDetail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(match.data?.seasonDetail?.poster_path || '', 'w92'),
  }),
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const TvSeasonDetail = () => {
  const { detail, seasonDetail, color } = useLoaderData<typeof loader>();
  const { tvId, seasonId } = useParams();
  const isHydrated = useHydrated();
  const [size, ref] = useMeasure<HTMLDivElement>();
  const [imageSize, imageRef] = useMeasure<HTMLDivElement>();
  const { backgroundColor } = useColorDarkenLighten(color);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isXl = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const { sidebarBoxedMode } = useSoraSettings();
  const { viewportRef, scrollY } = useLayout((scrollState) => scrollState);
  const { setBackgroundColor, startChangeScrollPosition } = useHeaderStyle(
    (headerState) => headerState,
  );
  const tabLinkRef = useRef<HTMLDivElement>(null);
  const tablinkIntersection = useIntersectionObserver(tabLinkRef, {
    root: viewportRef,
    rootMargin: sidebarBoxedMode ? '-180px 0px 0px 0px' : '-165px 0px 0px 0px',
    threshold: [1],
  });
  const paddingTop = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 100],
    [16, 16, startChangeScrollPosition ? 0 : 16],
  );
  const paddingBottom = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 100],
    [32, 32, startChangeScrollPosition ? 0 : 32],
  );
  useCustomHeaderChangePosition(tablinkIntersection);
  useEffect(() => {
    if (startChangeScrollPosition) {
      setBackgroundColor(backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, startChangeScrollPosition]);

  return (
    <>
      <Card
        as="section"
        radius="none"
        className="flex w-full flex-col border-0"
        style={{ height: `calc(${size?.height}px + 72px)` }}
      >
        <CardHeader
          ref={ref}
          className="rounded-b-0 absolute bottom-0 z-10 flex grow flex-col justify-center p-0"
        >
          <div className={backgroundStyles({ content: true })} />
          <div className="grid-areas-small sm:grid-areas-wide grid w-full max-w-[1920px] grid-cols-[1fr_2fr] grid-rows-[1fr_auto_auto] items-stretch justify-center gap-x-4 gap-y-6 px-3 pb-8 pt-5 sm:grid-rows-[auto_1fr_auto] sm:px-3.5 xl:px-4 2xl:px-5">
            <div className="grid-in-image flex flex-col items-center justify-center" ref={imageRef}>
              {seasonDetail?.poster_path ? (
                <Image
                  src={TMDB.posterUrl(seasonDetail?.poster_path)}
                  alt={seasonDetail?.name}
                  title={seasonDetail?.name}
                  classNames={{
                    wrapper: 'w-full sm:w-3/4 xl:w-1/2',
                    img: 'aspect-[2/3] !min-h-[auto] !min-w-[auto] shadow-xl shadow-default',
                  }}
                  placeholder="empty"
                  responsive={[
                    {
                      size: {
                        width: Math.round(
                          (imageSize?.width || 0) *
                            (!isXl && !isSm ? 0.5 : isXl && !isSm ? 0.75 : isXl && isSm ? 1 : 1),
                        ),
                        height: Math.round(
                          ((imageSize?.width || 0) *
                            3 *
                            (!isXl && !isSm ? 0.5 : isXl && !isSm ? 0.75 : isXl && isSm ? 1 : 1)) /
                            2,
                        ),
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              ) : (
                <div className="flex w-full items-center justify-center">
                  <Avatar
                    icon={<PhotoIcon width={48} height={48} />}
                    radius="xl"
                    classNames={{
                      base: 'w-full h-auto aspect-[2/3] sm:w-3/4 xl:w-1/2 shadow-xl shadow-default',
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid-in-title z-50 flex w-full flex-col items-start justify-start">
              <h2>
                {detail?.name} {seasonDetail?.name}
              </h2>
              <h5>
                {seasonDetail?.episodes?.length || 0} episodes &middot; {seasonDetail?.air_date}{' '}
              </h5>
            </div>
            {seasonDetail?.overview ? (
              <div className="grid-in-info flex flex-col gap-y-3 sm:gap-y-6">
                <h6>{seasonDetail.overview}</h6>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardBody
          style={{
            // @ts-ignore
            '--theme-movie-brand': isHydrated ? backgroundColor : 'transparent',
          }}
          className="after:from-movie-brand-color absolute bottom-0 p-0 after:absolute after:bottom-0 after:h-full after:w-full after:bg-gradient-to-t after:to-transparent after:content-['']"
        >
          <Image
            src={
              seasonDetail?.poster_path
                ? TMDB.posterUrl(seasonDetail?.poster_path, 'w342')
                : BackgroundDefault
            }
            radius="none"
            classNames={{
              wrapper: 'w-full h-auto object-cover max-w-full',
              img: `left-0 top-0 z-0 m-0 object-cover !opacity-30 blur-2xl ${
                size ? 'visible' : 'invisible'
              }'}`,
            }}
            title={seasonDetail?.name}
            alt={seasonDetail?.name}
            placeholder="empty"
            responsive={[
              {
                size: {
                  width: Math.round(size?.width || 0),
                  height: Math.round(size?.height || 0) + 72,
                },
              },
            ]}
            options={{
              blurRadius: 80,
              contentType: MimeType.WEBP,
            }}
            style={{
              width: Math.round(size?.width || 0),
              height: Math.round(size?.height || 0) + 72,
            }}
          />
        </CardBody>
      </Card>
      <div className="flex w-full flex-col items-center justify-center">
        <motion.div
          className="sticky top-[63px] z-[1000] flex w-full justify-center transition-[padding] duration-100 ease-in-out"
          style={{
            backgroundColor: isHydrated ? backgroundColor : 'transparent',
            paddingTop,
            paddingBottom,
          }}
          ref={tabLinkRef}
        >
          <div
            className={backgroundStyles({ tablink: true })}
            style={{ backgroundColor: isHydrated ? backgroundColor : 'transparent' }}
          />
          <TabLink pages={tvSeasonDetailPages} linkTo={`/tv-shows/${tvId}/season/${seasonId}`} />
        </motion.div>
        <Outlet />
      </div>
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default TvSeasonDetail;
