import { Link, useLoaderData } from '@remix-run/react';
import { LoaderFunction, json } from '@remix-run/node';
import { getHistory, getUserFromCookie, IHistory } from '~/services/supabase';
import { Container, Text } from '@nextui-org/react';
import MediaItem from '~/src/components/media/item';
import { User } from '@supabase/supabase-js';

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

const History = () => {
  const { histories, user } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Your watch history</h1>
      <Container fluid display="flex">
        {user ? (
          histories.map((item) => (
            <Link key={item.id} to={item.route}>
              <MediaItem
                key={item.id}
                type="card"
                coverItem={{
                  id: item.id ?? 0,
                  name: item.title ?? '',
                  backdropPath: item.poster ?? '',
                }}
                isCoverCard
              />
            </Link>
          ))
        ) : (
          <Text h2>Sign In to view your watch history</Text>
        )}
      </Container>
    </>
  );
};

export default History;
