import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, Link } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getListPeople } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import i18next from '~/i18n/i18next.server';
import SearchForm from '~/src/components/elements/SearchForm';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
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
    <Link to="/search/people" aria-label="Search People">
      Search People
    </Link>
  ),
};

const SearchRoute = () => {
  const { people } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/people/popular?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/people/${value}`);
  };

  return (
    <>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.people')}
        textPlaceHolder={t('search.placeHolder.people')}
      />
      <Container
        fluid
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {people && people.items && people.items.length > 0 && (
          <MediaList
            currentPage={people.page}
            items={people.items}
            listName={t('popularPeople')}
            listType="grid"
            onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
            showPagination
            totalPages={people.totalPages}
            itemsType="people"
          />
        )}
      </Container>
    </>
  );
};

export default SearchRoute;
