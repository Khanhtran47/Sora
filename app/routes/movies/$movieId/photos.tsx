/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { Image as NextImage, Row, Spacer } from '@nextui-org/react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Gallery, Item, GalleryProps } from 'react-photoswipe-gallery';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';
import { InView } from 'react-intersection-observer';

import i18next from '~/i18n/i18next.server';
import { getImages } from '~/services/tmdb/tmdb.server';
import { IMovieDetail } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import TMDB from '~/utils/media';
import { H6 } from '~/src/components/styles/Text.styles';

type LoaderData = {
  images: Awaited<ReturnType<typeof getImages>>;
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-movie.vercel.app/movies/${params.movieId}/photos`,
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const images = await getImages('movie', mid, locale);
  if (!images) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ images });
};

const PhotosPage = () => {
  const { images } = useLoaderData<LoaderData>();
  const movieData: { detail: IMovieDetail } | undefined = useRouteData('routes/movies/$movieId');
  const isLg = useMediaQuery(1280, 'max');
  const isXs = useMediaQuery(375, 'max');
  const smallItemStyles: React.CSSProperties = {
    cursor: 'pointer',
    objectFit: 'cover',
    minWidth: isXs ? '120px' : '185px',
    height: 'auto',
  };

  const uiElements: GalleryProps['uiElements'] = [
    {
      name: 'custom-rotate-button',
      ariaLabel: 'Rotate',
      order: 9,
      isButton: true,
      html: {
        isCustomSVG: true,
        inner:
          '<path d="M13.887 6.078C14.258 6.234 14.5 6.598 14.5 7V8.517C18.332 8.657 21.258 10.055 23.15 12.367 24.519 14.041 25.289 16.13 25.496 18.409A1 1 0 0123.504 18.591C23.327 16.645 22.68 14.952 21.601 13.633 20.156 11.867 17.831 10.653 14.5 10.517V12A1.002 1.002 0 0112.779 12.693L10.304 10.121A1.002 1.002 0 0110.324 8.713L12.8 6.286A1 1 0 0113.887 6.078ZM7.5 16A1.5 1.5 0 006 17.5V24.5A1.5 1.5 0 007.5 26H17.5A1.5 1.5 0 0019 24.5V17.5A1.5 1.5 0 0017.5 16H7.5Z" id="pswp__icn-rotate"/>',
        outlineID: 'pswp__icn-rotate',
      },
      appendTo: 'bar',
      onClick: (e, el, pswpInstance) => {
        const item = pswpInstance.currSlide.content.element;

        const prevRotateAngle = Number(item.dataset.rotateAngel) || 0;
        const rotateAngle = prevRotateAngle === 270 ? 0 : prevRotateAngle + 90;

        // add slide rotation
        item.style.transform = `${item.style.transform.replace(
          `rotate(-${prevRotateAngle}deg)`,
          '',
        )} rotate(-${rotateAngle}deg)`;
        item.dataset.rotateAngel = String(rotateAngle);
      },
      onInit: (el, pswpInstance) => {
        // remove applied rotation on slide change
        // https://photoswipe.com/events/#slide-content-events
        pswpInstance.on('contentRemove', () => {
          const item = pswpInstance.currSlide.content.element;
          item.style.transform = `${item.style.transform.replace(
            `rotate(-${item.dataset.rotateAngel}deg)`,
            '',
          )}`;
          delete item.dataset.rotateAngel;
        });
      },
    },
  ];
  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: 'calc(var(--nextui-space-sm))',
          paddingRight: 'calc(var(--nextui-space-sm))',
        },
        '@xs': {
          paddingLeft: '88px',
          paddingRight: '1rem',
        },
      }}
    >
      <Spacer y={1} />
      <Row justify="center" fluid>
        <H6 h6>
          <strong>Backdrops</strong>
        </H6>
      </Row>
      <Spacer y={0.5} />
      <Gallery withCaption withDownloadButton uiElements={uiElements}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${isLg ? 2 : 4}, 0fr)`,
            gridGap: 12,
          }}
        >
          {images?.backdrops?.map((image, index) => (
            <InView key={index} rootMargin="500px 200px" threshold={[0, 0.25, 0.5, 0.75, 1]}>
              {({ inView, ref: InViewRef }) => (
                <div ref={InViewRef}>
                  {inView && (
                    <Item
                      cropped
                      original={TMDB.profileUrl(image?.file_path, 'original')}
                      thumbnail={TMDB.profileUrl(image?.file_path, 'w185')}
                      alt={`Photo of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                      caption={`Photo of ${movieData?.detail?.title} size ${image.width}x${image.height}`}
                      width={image.width}
                      height={image.height}
                    >
                      {({ ref, open }) => (
                        <NextImage
                          // @ts-ignore
                          as={Image}
                          style={smallItemStyles}
                          src={TMDB.profileUrl(image?.file_path, 'w185')}
                          ref={ref as React.MutableRefObject<HTMLImageElement>}
                          onClick={open}
                          alt={`Photo of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                          containerCss={{
                            borderRadius: 10,
                            minWidth: isXs ? '120px' : '185px',
                          }}
                          title={movieData?.detail?.title}
                          loaderUrl="/api/image"
                          placeholder="blur"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                        />
                      )}
                    </Item>
                  )}
                </div>
              )}
            </InView>
          ))}
        </div>
      </Gallery>
      <Spacer y={1} />
      <Row justify="center" fluid>
        <H6 h6>
          <strong>Posters</strong>
        </H6>
      </Row>
      <Spacer y={0.5} />
      <Gallery withCaption withDownloadButton uiElements={uiElements}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${isLg ? 2 : 4}, 0fr)`,
            gridGap: 12,
          }}
        >
          {images?.posters?.map((image, index) => (
            <InView key={index} rootMargin="500px 200px" threshold={[0, 0.25, 0.5, 0.75, 1]}>
              {({ inView, ref: InViewRef }) => (
                <div ref={InViewRef}>
                  {inView && (
                    <Item
                      key={index}
                      cropped
                      original={TMDB.profileUrl(image?.file_path, 'original')}
                      thumbnail={TMDB.profileUrl(image?.file_path, 'w185')}
                      alt={`Photo of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                      caption={`Photo of ${movieData?.detail?.title} size ${image.width}x${image.height}`}
                      width={image.width}
                      height={image.height}
                    >
                      {({ ref, open }) => (
                        <NextImage
                          // @ts-ignore
                          as={Image}
                          style={smallItemStyles}
                          src={TMDB.profileUrl(image?.file_path, 'w185')}
                          ref={ref as React.MutableRefObject<HTMLImageElement>}
                          onClick={open}
                          alt={`Photo of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                          containerCss={{
                            borderRadius: 10,
                            minWidth: isXs ? '120px' : '185px',
                          }}
                          title={movieData?.detail?.title}
                          loaderUrl="/api/image"
                          placeholder="blur"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                        />
                      )}
                    </Item>
                  )}
                </div>
              )}
            </InView>
          ))}
        </div>
      </Gallery>
    </Row>
  );
};

export default PhotosPage;
