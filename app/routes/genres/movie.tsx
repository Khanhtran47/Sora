import { Badge, Button, Spacer } from '@nextui-org/react';
import { NavLink, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { H4 } from '~/components/styles/Text.styles';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/genres/movie" aria-label="Movie Genres">
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
          Movie Genres
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Genres',
    subtitle: 'Movie',
    showImage: false,
  }),
};

const MovieGenresPage = () => {
  const navigate = useNavigate();
  const { genresMovie } = useTypedRouteLoaderData('root');
  const { t } = useTranslation('genres');
  return (
    <div className="px-4">
      <H4>{t('movie-genres')}</H4>
      <Spacer y={1} />
      <div className="grid grid-cols-1 justify-center gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Object.entries(genresMovie).map(([id, name]) => (
          <Button
            key={id}
            type="button"
            flat
            auto
            onPress={() => navigate(`/discover/movies?with_genres=${id}`)}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MovieGenresPage;
