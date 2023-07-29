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
  { title: 'Sora Tv shows - Genres' },
  { name: 'description', content: 'Tv shows Genres' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/genres/tv' },
  { property: 'og:title', content: 'Sora Tv shows - Genres' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=tvshows' },
  { property: 'og:description', content: 'Tv shows Genres' },
  { name: 'twitter:title', content: 'Sora Tv shows - Genres' },
  { name: 'twitter:description', content: 'Tv shows Genres' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=tvshows' },
]);

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/genres/tv" key="genres-tv">
      {t('tv-shows')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ t }) => ({
    title: t('genres'),
    subtitle: t('tv-shows'),
    showImage: false,
  }),
};

const TvGenresPage = () => {
  const navigate = useNavigate();
  const { genresTv } = useTypedRouteLoaderData('root');
  const { t } = useTranslation('genres');
  const location = useLocation();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/genres/movie');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/genres/anime');
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
      <h4>{t('tv-show-genres')}</h4>
      <Spacer y={5} />
      <div className="grid grid-cols-1 justify-center gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Object.entries(genresTv).map(([id, name]) => (
          <Button
            key={id}
            color="primary"
            type="button"
            variant="flat"
            onPress={() => navigate(`/discover/tv-shows?with_genres=${id}`)}
          >
            {name}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default TvGenresPage;
