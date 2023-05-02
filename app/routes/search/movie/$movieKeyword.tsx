import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import {
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
  type RouteMatch,
} from '@remix-run/react';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getSearchMovies } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const keyword = params?.movieKeyword || '';
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      searchResults: await getSearchMovies(keyword, page, locale),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.search },
    },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  const { searchResults } = data;
  return {
    title: `Search results for '${params.movieKeyword}' movie on Sora`,
    description: `Watch ${params.movieKeyword} in full HD online with Subtitle`,
    keywords: `Watch ${params.movieKeyword}, Stream ${params.movieKeyword}, Watch ${params.movieKeyword} HD, Online ${params.movieKeyword}, Streaming ${params.movieKeyword}, English, Subtitle ${params.movieKeyword}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/search/movie/${params.movieKeyword}`,
    'og:title': `Search results for '${params.movieKeyword}' movie on Sora`,
    'og:description': `Watch ${params.movieKeyword} in full HD online with Subtitle`,
    'og:image': searchResults?.items[0]?.backdropPath || searchResults?.items[0]?.posterPath || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink
      to={`/search/movie/${match.params.movieKeyword}`}
      aria-label={match.params.movieKeyword}
    >
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          {match.params.movieKeyword}
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: 'Search results',
    subtitle: match.params.movieKeyword,
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<typeof loader>() || {};
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      return;
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/search/tv');
    }
  };

  const onSubmit = (value: string) => {
    navigate(`/search/movie/${value}`);
  };

  return (
    <motion.div
      key={location.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
      drag={isMobile && isHydrated ? 'x' : false}
      dragConstraints={isMobile && isHydrated ? { left: 0, right: 0 } : false}
      dragElastic={isMobile && isHydrated ? 0.7 : false}
      onDragEnd={handleDragEnd}
      dragDirectionLock={isMobile && isHydrated}
      draggable={isMobile && isHydrated}
    >
      <SearchForm
        onSubmit={onSubmit}
        textHelper={t('search.helper.movie')}
        textOnButton={t('search.action')}
        textPlaceHolder={t('search.placeHolder.movie')}
      />
      {searchResults && searchResults.items && searchResults.items.length > 0 && (
        <MediaList
          currentPage={searchResults?.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={searchResults?.items}
          itemsType="movie"
          listName={t('search.searchResults')}
          listType="grid"
          showListTypeChangeButton
          totalPages={searchResults?.totalPages}
        />
      )}
    </motion.div>
  );
};

export default SearchRoute;
