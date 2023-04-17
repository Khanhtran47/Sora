import { useRef, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Container,
  Grid,
  Input,
  Pagination,
  Text,
} from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation, useNavigate } from '@remix-run/react';

import { authenticate, getCountHistory, getHistory, type IHistory } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import HistoryItem from '~/components/media/item/HistoryItem';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/watch-history" aria-label="Watch History Page">
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
          History
        </Badge>
      )}
    </NavLink>
  ),
  getSitemapEntries: () => null,
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticate(request, true, true);

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const types = searchParams.get('types');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  return json(
    {
      histories: user ? await getHistory(user.id, types, from, to, page) : [],
      totalPage: user ? Math.ceil((await getCountHistory(user.id, types, from, to)) / 20) : 0,
      page,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.default,
      },
    },
  );
};

const History = () => {
  const { histories, page, totalPage } = useLoaderData<typeof loader>();
  const isXs = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const sParams = new URLSearchParams(location.search);

  const [types, setTypes] = useState(sParams.get('types')?.split(',') || []);
  const [from, setFrom] = useState(sParams.get('from'));
  const [to, setTo] = useState(sParams.get('to'));

  const searchHistoryHandler = () => {
    const params = new URLSearchParams();
    if ([1, 2].includes(types?.length)) params.append('types', types?.join(','));
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    navigate(`/watch-history?${params.toString()}`);
  };

  const paginationChangeHandler = (_page: number) => {
    const url = new URL(document.URL);
    url.searchParams.set('page', _page.toString());
    navigate(`${url.pathname}${url.search}`);
  };

  return (
    <Container fluid responsive={false} css={{ margin: 0, padding: 0, textAlign: 'center' }}>
      <Text h2>Your watch history</Text>
      <Container fluid responsive={false}>
        <Grid.Container gap={2} justify="center" ref={ref}>
          <Grid xs={12}>
            <Grid.Container gap={2}>
              <Grid md={4} sm={6} xs={12}>
                <Checkbox.Group
                  label="Select media types"
                  orientation="horizontal"
                  color="secondary"
                  defaultValue={types}
                  onChange={(values) => setTypes(values)}
                >
                  <Checkbox value="movie">Movie</Checkbox>
                  <Checkbox value="tv">TV Show</Checkbox>
                  <Checkbox value="anime">Anime</Checkbox>
                </Checkbox.Group>
              </Grid>
              <Grid sm={6} xs={12}>
                <Input
                  width="186px"
                  label="From"
                  type="date"
                  css={{ marginRight: '1rem' }}
                  value={from || undefined}
                  onChange={(e) => setFrom(e.target.value)}
                />
                <Input
                  width="186px"
                  label="To"
                  type="date"
                  value={to || undefined}
                  onChange={(e) => setTo(e.target.value)}
                />
              </Grid>
              <Grid xs={12}>
                <Button
                  type="button"
                  // shadow
                  color="primary"
                  auto
                  onPress={searchHistoryHandler}
                >
                  Search History
                </Button>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid xs={12} css={isXs ? { paddingLeft: '$0', paddingRight: '$0' } : {}}>
            <Grid.Container gap={2}>
              {histories.map((item) => (
                <Grid
                  key={item.id}
                  xs={12}
                  sm={6}
                  md={4}
                  css={isXs ? { paddingLeft: '$0', paddingRight: '$0' } : {}}
                >
                  <HistoryItem item={item as unknown as IHistory} />
                </Grid>
              ))}
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>

      {totalPage > 1 && (
        <Pagination
          total={totalPage}
          initialPage={page}
          // shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      )}
    </Container>
  );
};

export default History;
