import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, useTransform } from 'framer-motion';
import { useHydrated } from 'remix-utils';

import type { Handle } from '~/types/handle';
import { getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import getProviderList from '~/services/provider.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayout } from '~/store/layout/useLayout';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useCustomHeaderChangePosition } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { animeDetailsPages } from '~/constants/tabLinks';
import { AnimeDetail, MediaBackgroundImage } from '~/components/media/MediaDetail';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import TabLink from '~/components/elements/tab/TabLink';
import { backgroundStyles } from '~/components/styles/primitives';

export const loader = async ({ request, params }: LoaderArgs) => {
  const { animeId } = params;
  const aid = Number(animeId);
  if (!animeId) throw new Response('Not Found', { status: 404 });
  await authenticate(request, undefined, true);
  const detail = await getAnimeInfo(animeId);
  if (!detail) throw new Response('Not Found', { status: 404 });
  const title = detail.title?.english || detail.title?.userPreferred || detail.title?.romaji || '';
  const orgTitle = detail.title?.native;
  const year = detail.releaseDate;
  const animeType = detail?.type?.toLowerCase() || 'tv';
  const isEnded = detail?.status === 'FINISHED';
  const providers = await getProviderList({
    type: 'anime',
    title,
    orgTitle,
    year,
    season: undefined,
    animeId: aid,
    animeType,
    isEnded,
  });

  if (providers && providers.length > 0) {
    return json({ detail, providers });
  }
  return json(
    {
      detail,
      providers: [],
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.detail } },
  );
};

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) {
    return [];
  }
  const { detail } = data;
  const { title } = detail || {};
  const animeTitle = title?.userPreferred || title?.english || title?.romaji || title?.native || '';
  return [
    { property: 'og:image', content: `https://img.anili.st/media/${params.animeId}` },
    {
      name: 'keywords',
      content: `Watch ${animeTitle}, Stream ${animeTitle}, Watch ${animeTitle} HD, Online ${animeTitle}, Streaming ${animeTitle}, English, Subtitle ${animeTitle}, English Subtitle`,
    },
    { name: 'twitter:image', content: `https://img.anili.st/media/${params.animeId}` },
  ];
});

export const handle: Handle = {
  breadcrumb: ({ match }) => (
    <BreadcrumbItem to={`/anime/${match.params.animeId}`} key={`anime-${match.params.animeId}`}>
      {match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
    </BreadcrumbItem>
  ),
  miniTitle: ({ match, t }) => ({
    title:
      match.data?.detail?.title?.userPreferred ||
      match.data?.detail?.title?.english ||
      match.data?.detail?.title?.romaji ||
      match.data?.detail?.title?.native ||
      '',
    subtitle: t('overview'),
    showImage: match.data?.detail?.image !== undefined,
    imageUrl: match.data?.detail?.image,
  }),
  preventScrollToTop: true,
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const AnimeDetailPage = () => {
  const { detail } = useLoaderData<typeof loader>();
  const { state } = useLocation();
  const isHydrated = useHydrated();
  const { backgroundColor } = useColorDarkenLighten(detail?.color);
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

  const currentTime = state && (state as { currentTime: number | undefined }).currentTime;

  return (
    <>
      <MediaBackgroundImage backdropPath={detail?.cover} backgroundColor={backgroundColor} />
      <div className="relative top-[-80px] w-full sm:top-[-200px]">
        <AnimeDetail item={detail} trailerTime={currentTime} />
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
            <TabLink pages={animeDetailsPages} linkTo={`/anime/${detail?.id}`} />
          </motion.div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export function ErrorBoundary() {
  return (
    <ErrorBoundaryView
      statusHandlers={{
        404: ({ params }) => <p>There is no anime with the ID: {params.animeId}</p>,
      }}
    />
  );
}

export default AnimeDetailPage;
