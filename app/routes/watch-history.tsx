import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunction, json } from '@remix-run/node';
import { getCountHistory, getHistory, getUserFromCookie, IHistory } from '~/services/supabase';
import { Card, Container, Grid, Pagination, Row, Text } from '@nextui-org/react';
import { User } from '@supabase/supabase-js';
import Image, { MimeType } from 'remix-image';

import useMediaQuery from '~/hooks/useMediaQuery';
import notFound from '../src/assets/images/404.gif';

export const handle = {
  breadcrumb: () => <Link to="/watch-history">History</Link>,
};

type LoaderData = {
  histories: IHistory[];
  user?: User;
  page: number;
  totalPage: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const user = await getUserFromCookie(request.headers.get('Cookie') || '');

  return json<LoaderData>({
    histories: user ? await getHistory(user.id, page) : [],
    totalPage: user ? Math.ceil((await getCountHistory(user.id)) / 20) : 1,
    user,
    page,
  });
};

const Item = ({ _history }: { _history: IHistory }) => (
  <Grid>
    <Card>
      <Card.Body css={{ mw: '330px', margin: 0, padding: 0 }}>
        <Card.Image
          // @ts-expect-error: hm
          as={Image}
          width="24rem"
          height="13.5rem"
          src={_history.poster || notFound}
          alt={_history.title}
          objectFit="cover"
          loaderUrl="/api/image"
          placeholder="blur"
          options={{
            contentType: MimeType.WEBP,
          }}
        />
      </Card.Body>
      <Row justify="flex-start">
        <Text
          h6
          css={{
            fontSize: '1.1rem',
            marginLeft: '0.5rem',
            marginBottom: '$0',
            maxWidth: '20rem',
          }}
        >
          {_history.title && _history.title.length > 0 ? _history.title : 'No title'}
        </Text>
      </Row>
      <Row justify="space-between">
        <Text css={{ marginLeft: '1rem' }}>
          {_history.season && `- SS ${_history.season} `}
          {_history.episode && `- EP ${_history.episode.at(-1)} `}
        </Text>
        <Text css={{ marginRight: '1rem' }}>
          {new Date(_history.updated_at?.toString()).toLocaleString()}
        </Text>
      </Row>
    </Card>
  </Grid>
);

const History = () => {
  const { histories, user, page, totalPage } = useLoaderData<LoaderData>();
  const isXs = useMediaQuery(650);
  const navigate = useNavigate();

  const paginationChangeHandler = (_page: number) => navigate(`/watch-history?page=${_page}`);

  return (
    <Container fluid css={{ margin: 0, padding: 0, textAlign: 'center' }}>
      <Text h2>Your watch history</Text>
      <Grid.Container gap={2}>
        {user ? (
          histories
            .map((item) => {
              const url = new URL(`http://abc${item.route}`);
              if (item.watched !== 0) url.searchParams.append('t', item.watched.toString());
              return { ...item, route: url.pathname + url.search };
            })
            .map((item) => (
              <Link key={item.route} to={item.route}>
                <Item _history={item as unknown as IHistory} />
              </Link>
            ))
        ) : (
          <Text h2>Sign In to view your watch history</Text>
        )}
      </Grid.Container>
      {totalPage > 1 && (
        <Pagination
          total={totalPage}
          initialPage={page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      )}
    </Container>
  );
};

export default History;
