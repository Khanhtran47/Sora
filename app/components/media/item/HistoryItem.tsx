import { Card, Col, Grid, Image, Progress, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useMeasure } from '@react-hookz/web';

import type { IHistory } from '~/services/supabase';

import notFound from '~/assets/images/404.gif';

interface IHistoryItem {
  item: IHistory;
}

const HistoryItem = ({ item }: IHistoryItem) => {
  const [size, ref] = useMeasure<HTMLDivElement>();
  const watched = Math.round((item.watched / item.duration) * 100);

  const url = new URL(`http://abc${item.route}`);
  if (item.watched !== 0) {
    url.searchParams.set('t', item.watched.toString());
  }

  return (
    <Card isPressable isHoverable ref={ref}>
      <Link to={url.pathname + url.search}>
        <Grid.Container gap={2}>
          {/* left */}
          <Grid xs={6} css={{ padding: '$0' }} justify="flex-start">
            <Col>
              <Image
                showSkeleton
                width="16rem"
                height="9rem"
                src={item.poster || notFound}
                alt={item.title}
                objectFit="cover"
                placeholder="empty"
              />
              {watched > 5 && <Progress size="xs" value={watched} color="error" />}
            </Col>
          </Grid>
          {/* right */}
          <Grid xs={6}>
            <Grid.Container
              alignContent="flex-start"
              css={size?.width && size.width > 350 ? { marginTop: '1rem' } : {}}
            >
              {/* title */}
              <Grid xs={12}>
                <Text h1 size="$md">
                  {item.title}
                </Text>
              </Grid>
              <Grid xs={12}>
                {item.season && <Text size="$sm">SS {item.season}&ensp;-&ensp;</Text>}
                {item.episode && <Text size="$sm">EP {item.episode.split('-').at(-1)}</Text>}
              </Grid>
              <Grid xs={12}>
                <Text size="$sm">{new Date(item.updated_at.toString()).toLocaleString()}</Text>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Link>
    </Card>
  );
};

export default HistoryItem;
