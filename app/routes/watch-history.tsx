import { Link, useLoaderData } from '@remix-run/react';
import { LoaderFunction, json } from '@remix-run/node';
import { getHistory, getUserFromCookie, IHistory } from '~/services/supabase';
import { Card, Container, Grid, Image, Row, Text } from '@nextui-org/react';
import { User } from '@supabase/supabase-js';

import notFound from '../src/assets/images/404.gif';

export const handle = {
  breadcrumb: () => <Link to="/watch-history">History</Link>,
};

type LoaderData = {
  histories: IHistory[];
  user?: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) ?? 0;
  const user = await getUserFromCookie(request.headers.get('Cookie') ?? '');

  return json<LoaderData>({ histories: user ? await getHistory(user.id, page) : [], user });
};

const Item = ({ _history }: { _history: IHistory }) => (
  <Grid>
    <Card>
      <Card.Body css={{ mw: '330px', margin: 0, padding: 0 }}>
        <Image
          width="24rem"
          height="13.5rem"
          src={_history.poster ?? notFound}
          alt={_history.title}
          objectFit="cover"
        />
      </Card.Body>
      <Row justify="flex-start">
        <Text h6 css={{ fontSize: '1.25rem', marginLeft: '1rem', marginBottom: '$0' }}>
          {_history.title && _history.title?.length > 0 ? _history.title : 'No title'}
        </Text>
      </Row>
      <Row justify="flex-end">
        <Text css={{ marginRight: '1rem' }}>
          {new Date(_history.updated_at?.toString()).toLocaleString()}
        </Text>
      </Row>
    </Card>
  </Grid>
);

const History = () => {
  const { histories, user } = useLoaderData<LoaderData>();

  return (
    <Container fluid css={{ margin: 0, padding: 0 }}>
      <h2 style={{ textAlign: 'center' }}>Your watch history</h2>
      <Grid.Container gap={2}>
        {user ? (
          histories.map((item) => (
            <Link key={item.id} to={item.route}>
              <Item _history={item as unknown as IHistory} />
            </Link>
          ))
        ) : (
          <Text h2>Sign In to view your watch history</Text>
        )}
      </Grid.Container>
    </Container>
  );
};

export default History;
