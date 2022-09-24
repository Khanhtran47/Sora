/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Grid, Loading, Row, Spacer, Text, Image as NextImage } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { ClientOnly } from 'remix-utils';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';

const CardItemHover = ({
  item,
  genresMovie,
  genresTv,
  trailer,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  trailer?: Trailer;
}) => {
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath, backdropPath } = item;
  const { loading, colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const [showTrailer, setShowTrailer] = React.useState<boolean>(false);

  return (
    <Grid.Container
      css={{
        padding: '0.75rem 0.375rem',
        minWidth: '350px',
        maxWidth: '400px',
        width: 'inherit',
      }}
    >
      {loading ? (
        <Loading type="points-opacity" />
      ) : (
        <>
          <AnimatePresence>
            {backdropPath && !showTrailer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <NextImage
                  // @ts-ignore
                  as={Image}
                  src={backdropPath || ''}
                  objectFit="cover"
                  width="100%"
                  height="218px"
                  alt={title}
                  title={title}
                  containerCss={{
                    borderRadius: '0.5rem',
                  }}
                  css={{
                    minWidth: '240px !important',
                    minHeight: 'auto !important',
                  }}
                  loaderUrl="/api/image"
                  placeholder="blur"
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                  responsive={[
                    {
                      size: {
                        width: 388,
                        height: 218,
                      },
                    },
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <ClientOnly fallback={<Loading type="default" />}>
            {() => {
              if (trailer?.key)
                return (
                  <YouTube
                    videoId={trailer.key}
                    opts={{
                      width: '388px',
                      height: '218.25px',
                      playerVars: {
                        // https://developers.google.com/youtube/player_parameters
                        autoplay: 1,
                        modestbranding: 1,
                        controls: 0,
                        disablekb: 1,
                        showinfo: 0,
                        branding: 0,
                        rel: 0,
                        autohide: 0,
                        iv_load_policy: 3,
                        cc_load_policy: 0,
                        playsinline: 1,
                      },
                    }}
                    // onReady={({ target }) => {
                    // setPlayer(target);
                    //   target.mute();
                    // }}
                    onPlay={() => {
                      if (setShowTrailer) {
                        setShowTrailer(true);
                      }
                    }}
                    onPause={() => {
                      if (setShowTrailer) {
                        setShowTrailer(false);
                      }
                    }}
                    onEnd={() => {
                      if (setShowTrailer) {
                        setShowTrailer(false);
                      }
                    }}
                    onError={() => {
                      if (setShowTrailer) {
                        setShowTrailer(false);
                      }
                    }}
                    style={{
                      width: '388px',
                      height: '218.25px',
                      pointerEvents: 'none',
                    }}
                    className={
                      showTrailer ? 'aspect-w-16 aspect-h-9 rounded-lg overflow-hidden' : 'hidden'
                    }
                  />
                );
            }}
          </ClientOnly>
          <Row justify="center" align="center">
            <Spacer y={0.5} />
            <Text size={18} b color={colorDarkenLighten}>
              {title}
            </Text>
          </Row>
          {overview && (
            <Row>
              {item?.genreIds?.slice(0, 3).map((genreId) => {
                if (mediaType === 'movie') {
                  return (
                    <>
                      {genresMovie?.[genreId]}
                      <Spacer x={0.5} />
                    </>
                  );
                }
                return (
                  <>
                    {genresTv?.[genreId]}
                    <Spacer x={0.5} />
                  </>
                );
              })}
            </Row>
          )}
          {overview && (
            <Row>
              <Text>{`${overview?.substring(0, 100)}...`}</Text>
            </Row>
          )}
          <Grid.Container justify="space-between" alignContent="center">
            {releaseDate && (
              <Grid>
                <Text>{`${mediaType === 'movie' ? 'Movie' : 'TV-Shows'} • ${releaseDate}`}</Text>
              </Grid>
            )}
            {voteAverage && (
              <Grid>
                <Row>
                  <Text
                    weight="bold"
                    size="$xs"
                    css={{
                      backgroundColor: '#3ec2c2',
                      borderRadius: '$xs',
                      padding: '0 0.25rem 0 0.25rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    TMDb
                  </Text>
                  <Text size="$sm" weight="bold">
                    {item?.voteAverage?.toFixed(1)}
                  </Text>
                </Row>
              </Grid>
            )}
          </Grid.Container>
        </>
      )}
    </Grid.Container>
  );
};

export default CardItemHover;
