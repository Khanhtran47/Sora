import { Button, Spacer } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@remix-run/react';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { H4 } from '~/components/styles/Text.styles';

const TvGenresPage = () => {
  const navigate = useNavigate();
  const { genresTv } = useTypedRouteLoaderData('root');
  const { t } = useTranslation('genres');
  return (
    <div className="px-4">
      <H4>{t('tv-show-genres')}</H4>
      <Spacer y={1} />
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 justify-center">
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
