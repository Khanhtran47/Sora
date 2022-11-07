import { Card, Col, Grid, Image, Progress, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useRef } from 'react';
import useSize, { IUseSize } from '~/hooks/useSize';
import { IHistory } from '~/services/supabase';
import notFound from '~/src/assets/images/404.gif';

interface IHistoryItem {
  item: IHistory;
}

const HistoryItem = ({ item }: IHistoryItem) => {
  const ref = useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);
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
                placeholder="blur"
              />
              {watched > 5 && <Progress size="xs" value={watched} color="error" />}
            </Col>
          </Grid>
          {/* right */}
          <Grid xs={6}>
            <Grid.Container
              alignContent="flex-start"
              css={size.width > 350 ? { marginTop: '1rem' } : {}}
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
