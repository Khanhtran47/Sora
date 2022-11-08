/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Col } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';

import { getTvShowDetail, getTranslations } from '~/services/tmdb/tmdb.server';
import { ISeasonDetail } from '~/services/tmdb/tmdb.types';
import i18next from '~/i18n/i18next.server';
import useMediaQuery from '~/hooks/useMediaQuery';

import ListEpisodes from '~/src/components/elements/shared/ListEpisodes';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  translations?: Awaited<ReturnType<typeof getTranslations>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { tvId } = params;
  const tid = Number(tvId);
  if (!tid) throw new Response('Not Found', { status: 404 });

  const detail = await getTvShowDetail(tid, locale);
  if (!tid) throw new Response('Not Found', { status: 404 });
  if ((detail && detail?.original_language !== 'en') || locale !== 'en') {
    const translations = await getTranslations('tv', tid);
    return json<LoaderData>({ detail, translations });
  }

  return json<LoaderData>({ detail });
};

const Episodes = () => {
  const { detail, translations } = useLoaderData<LoaderData>();
  const seasonData: { detail: ISeasonDetail } | undefined = useRouteData(
    'routes/tv-shows/$tvId.season.$seasonId',
  );
  const seasonDetail = seasonData && seasonData.detail;
  const isSm = useMediaQuery(650, 'max');
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '0 0.75rem',
        '@xs': {
          padding: '0 3vw',
        },
        '@sm': {
          padding: '0 6vw',
        },
        '@md': {
          padding: '0 12vw',
        },
      }}
    >
      <Col span={isSm ? 12 : 8}>
        <ListEpisodes
          type="tv"
          id={detail?.id}
          episodes={seasonDetail?.episodes}
          title={detail?.name || ''}
          orgTitle={detail?.original_name || ''}
          year={new Date(seasonDetail?.air_date || '').getFullYear()}
          translations={translations}
          season={seasonDetail?.season_number}
        />
      </Col>
    </Row>
  );
};

export default Episodes;
