import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useCatch, useLoaderData, useLocation, type RouteMatch } from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';

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
import WatchTrailerModal from '~/components/elements/dialog/WatchTrailerModal';
import CatchBoundaryView from '~/components/elements/shared/CatchBoundaryView';
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

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Anime',
      description: `There is no anime with the ID: ${params.animeId}`,
    };
  }
  const { detail } = data;
  const { title, color, description } = detail || {};
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    description: description
      ? description?.replace(/<\/?[^>]+(>|$)/g, '')
      : `Watch ${
          title?.userPreferred || title?.english || title?.romaji || title?.native || ''
        } in full HD online with Subtitle`,
    keywords: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, Stream ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD, Online ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, Streaming ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, English, Subtitle ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, English Subtitle`,
    ...(color ? { 'theme-color': color } : null),
    'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    'og:description': description
      ? description?.replace(/<\/?[^>]+(>|$)/g, '')
      : `Watch ${
          title?.userPreferred || title?.english || title?.romaji || title?.native || ''
        } in full HD online with Subtitle`,
    'og:image': `https://img.anili.st/media/${params.animeId}`,
    'twitter:card': 'summary_large_image',
    'twitter:site': '@sora_anime',
    'twitter:domain': 'sora-anime.vercel.app',
    'twitter:url': `https://sora-anime.vercel.app/anime/${params.animeId}`,
    'twitter:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    'twitter:description': description
      ? description?.replace(/<\/?[^>]+(>|$)/g, '')
      : `Watch ${
          title?.userPreferred || title?.english || title?.romaji || title?.native || ''
        } in full HD online with Subtitle`,
    'twitter:image': `https://img.anili.st/media/${params.animeId}`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem to={`/anime/${match.params.animeId}`} key={`anime-${match.params.animeId}`}>
      {match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
    </BreadcrumbItem>
  ),
  miniTitle: (match: RouteMatch) => ({
    title:
      match.data?.detail?.title?.userPreferred ||
      match.data?.detail?.title?.english ||
      match.data?.detail?.title?.romaji ||
      match.data?.detail?.title?.native ||
      '',
    subtitle: 'Overview',
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
  const [visible, setVisible] = useState(false);
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
  const Handler = () => {
    setVisible(true);
  };
  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <MediaBackgroundImage backdropPath={detail?.cover} backgroundColor={backgroundColor} />
      <div className="relative top-[-80px] w-full sm:top-[-200px]">
        <AnimeDetail item={detail} handler={Handler} />
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            className="sticky top-[64px] z-[1000] flex w-full justify-center transition-[padding] duration-100 ease-in-out"
            style={{
              backgroundColor,
              paddingTop,
              paddingBottom,
            }}
            ref={tabLinkRef}
          >
            <div className={backgroundStyles({ tablink: true })} style={{ backgroundColor }} />
            <TabLink pages={animeDetailsPages} linkTo={`/anime/${detail?.id}`} />
          </motion.div>
          <Outlet />
        </div>
      </div>
      {detail && detail.trailer ? (
        <WatchTrailerModal
          trailer={detail.trailer}
          visible={visible}
          closeHandler={closeHandler}
          currentTime={Number(currentTime)}
        />
      ) : null}
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default AnimeDetailPage;
