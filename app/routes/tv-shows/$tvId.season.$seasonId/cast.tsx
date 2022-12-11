/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row } from '@nextui-org/react';

import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';
import { getTvSeasonCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { IMedia } from '~/types/media';

import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  cast: IMedia[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticate(request);

  const locale = await i18next.getLocale(request);
  const { tvId, seasonId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not found', { status: 404 });
  const credits = await getTvSeasonCredits(tid, Number(seasonId), locale);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ cast: [...postFetchDataHandler(credits.cast, 'people')] });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/cast`,
});

const CastPage = () => {
  const { cast } = useLoaderData<LoaderData>();

  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        display: 'flex',
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: '$sm',
          paddingRight: '$sm',
        },
      }}
    >
      {cast && cast.length > 0 && (
        <MediaList listType="grid" items={cast} listName="Cast" virtual itemsType="people" />
      )}
    </Row>
  );
};

export default CastPage;
