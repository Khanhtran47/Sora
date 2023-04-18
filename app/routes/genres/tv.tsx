import { Badge, Button, Spacer } from '@nextui-org/react';
import { NavLink, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { H4 } from '~/components/styles/Text.styles';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/genres/tv" aria-label="Tv Show Genres">
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
          Tv Show Genres
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Genres',
    subtitle: 'Tv Show',
    showImage: false,
  }),
};

const TvGenresPage = () => {
  const navigate = useNavigate();
  const { genresTv } = useTypedRouteLoaderData('root');
  const { t } = useTranslation('genres');
  return (
    <div className="px-4">
      <H4>{t('tv-show-genres')}</H4>
      <Spacer y={1} />
      <div className="grid grid-cols-1 justify-center gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Object.entries(genresTv).map(([id, name]) => (
          <Button
            key={id}
            type="button"
            flat
            auto
            onPress={() => navigate(`/discover/tv-shows?with_genres=${id}`)}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TvGenresPage;
