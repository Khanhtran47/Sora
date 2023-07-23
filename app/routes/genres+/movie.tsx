import { Button } from '@nextui-org/button';
import { Spacer } from '@nextui-org/spacer';
import { useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import type { Handle } from '~/types/handle';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora Movies - Genres' },
  { name: 'description', content: 'Movies Genres' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/genres/movies' },
  { property: 'og:title', content: 'Sora Movies - Genres' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=movies' },
  { property: 'og:description', content: 'Movies Genres' },
  { name: 'twitter:title', content: 'Sora Movies - Genres' },
  { name: 'twitter:description', content: 'Movies Genres' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=movies' },
]);

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/genres/movie" key="genres-movie">
      {t('movie')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ t }) => ({
    title: t('genres'),
    subtitle: t('movie'),
    showImage: false,
  }),
};

const MovieGenresPage = () => {
  const navigate = useNavigate();
  const { genresMovie } = useTypedRouteLoaderData('root');
  const { t } = useTranslation('genres');
  const location = useLocation();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      return;
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/genres/tv');
    }
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
      <h4>{t('movie-genres')}</h4>
      <Spacer y={5} />
      <div className="grid grid-cols-1 justify-center gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Object.entries(genresMovie).map(([id, name]) => (
          <Button
            key={id}
            type="button"
            variant="flat"
            color="primary"
            onPress={() => navigate(`/discover/movies?with_genres=${id}`)}
          >
            {name}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default MovieGenresPage;
