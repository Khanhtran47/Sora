import { useEffect, useState } from 'react';
import { Spacer } from '@nextui-org/spacer';
import { useFetcher } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { useTranslation } from 'react-i18next';

import type { IMedia } from '~/types/media';
import type { loader as peopleIdLoader } from '~/routes/people+/$peopleId';
import type { IPeople } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta = mergeMeta<null, { 'routes/people+/$peopleId': typeof peopleIdLoader }>(
  ({ params, matches }) => {
    const peopleData = matches.find((match) => match.id === 'routes/people+/$peopleId')?.data;
    if (!peopleData) {
      return [
        { title: 'Missing People' },
        { name: 'description', content: `There is no people with the ID: ${params.peopleId}` },
      ];
    }
    const { detail } = peopleData;
    const { name } = detail || {};
    const peopleTitle = name || '';
    return [
      { title: `Sora - ${peopleTitle}` },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/people/${params.peopleId}/`,
      },
      { property: 'og:title', content: `Sora - ${peopleTitle}` },
      { name: 'twitter:title', content: `Sora - ${peopleTitle}` },
    ];
  },
);

const OverviewPage = () => {
  const peopleData = useTypedRouteLoaderData('routes/people+/$peopleId');
  const rootData = useTypedRouteLoaderData('root');
  const fetcher = useFetcher();
  const { t } = useTranslation();
  const [knownFor, setKnownFor] = useState<IMedia[]>();
  useEffect(() => {
    if (peopleData?.detail?.name) {
      fetcher.load(`/search/people/${peopleData?.detail?.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (fetcher.data && fetcher.data.searchResults) {
      const { items } = fetcher.data.searchResults;
      const peopleFound = items.find((result: IPeople) => result.id === peopleData?.detail?.id);
      if (peopleFound) {
        setKnownFor(TMDB.postFetchDataHandler(peopleFound?.knownFor));
      }
    }
  }, [fetcher.data, peopleData?.detail?.id]);
  return (
    <>
      {peopleData?.detail?.biography ? (
        <>
          <div className="flex flex-col gap-y-2">
            <h4>{t('biography')}</h4>
            <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
              {/* TODO: add a read more button */}
              {peopleData?.detail?.biography}
            </p>
          </div>
          <Spacer y={7} />
        </>
      ) : null}
      {knownFor && knownFor.length > 0 ? (
        <>
          <h4>{t('known-for')}</h4>
          <Spacer y={2.5} />
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={knownFor}
            itemsType="movie-tv"
            listType="slider-card"
          />
        </>
      ) : null}
    </>
  );
};

export default OverviewPage;
