import { useLoaderData, useNavigate, useLocation, Link } from '@remix-run/react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { authenticate } from '~/services/supabase';
import PeopleList from '~/src/components/people/PeopleList';
import { getListPeople } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const meta: MetaFunction = () => ({
  title: 'Discover most popular celebs on Sora',
  description: 'Discover the most popular celebrities right now on Sora.',
  keywords:
    'popular celebrities, popular celebrity, top celebrities, top celebrity, people celebrity, celebrity people, best celebrity, best celebrities, famous celebrity, famous people, celebrity movies, movies by celebrity, celebrity tv shows, tv show celebrities, celebrity television shows, celebrity tv series',
  'og:url': 'https://sora-anime.vercel.app/people',
  'og:title': 'Discover most popular celebs on Sora',
  'og:image': 'https://static.alphacoders.com/thumbs_categories/20.jpg',
  'og:description': 'Discover the most popular celebrities right now on Sora.',
});

export const loader: LoaderFunction = async ({ request }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    people: await getListPeople('popular', locale, page),
  });
};

export const handle = {
  breadcrumb: () => (
    <Link to="/people?index" aria-label="Popular People">
      Popular People
    </Link>
  ),
};

const ListPeoplePopular = () => {
  const { people } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/people?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="center"
        css={{
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {people && people.results && people.results.length > 0 && (
          <>
            <PeopleList listType="grid" items={people.results} listName={t('popularPeople')} />
            <Pagination
              total={people.total_pages}
              initialPage={people.page}
              shadow
              onChange={paginationChangeHandler}
              css={{ marginTop: '30px' }}
              {...(isXs && { size: 'xs' })}
            />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ListPeoplePopular;
