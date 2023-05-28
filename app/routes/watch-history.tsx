import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox';
import { Input } from '@nextui-org/input';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';

import { authenticate, getCountHistory, getHistory, type IHistory } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import HistoryItem from '~/components/media/item/HistoryItem';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/watch-history" key="watch-history">
      History
    </BreadcrumbItem>
  ),
  getSitemapEntries: () => null,
  miniTitle: () => ({
    title: 'History',
    showImage: false,
  }),
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
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex w-full flex-col justify-start gap-6">
      <h2>Your watch history</h2>
      <div className="flex flex-row flex-wrap items-center justify-start gap-6">
        <CheckboxGroup
          label="Select media types"
          orientation="horizontal"
          color="primary"
          defaultValue={types}
          onChange={(values) => setTypes(values)}
        >
          <Checkbox value="movie">Movie</Checkbox>
          <Checkbox value="tv">TV Show</Checkbox>
          <Checkbox value="anime">Anime</Checkbox>
        </CheckboxGroup>
        <div className="flex gap-x-2">
          <Input
            label="From"
            type="date"
            placeholder="Enter your date"
            value={from || undefined}
            onValueChange={setFrom}
          />
          <Input
            label="To"
            type="date"
            placeholder="Enter your date"
            value={to || undefined}
            onValueChange={setTo}
          />
        </div>
      </div>
      <Button
        type="button"
        color="primary"
        size="md"
        onPress={searchHistoryHandler}
        className="w-48"
      >
        Search History
      </Button>
      <div className="grid w-full grid-cols-1 justify-items-center gap-4 xl:grid-cols-2">
        {histories.map((item) => (
          <HistoryItem key={item.id} item={item as unknown as IHistory} />
        ))}
      </div>
      {totalPage > 1 ? (
        <div className="mt-7 flex justify-center">
          <Pagination
            showControls={!isSm}
            total={totalPage}
            initialPage={page}
            // shadow
            onChange={paginationChangeHandler}
            {...(isSm && { size: 'xs' })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default History;
