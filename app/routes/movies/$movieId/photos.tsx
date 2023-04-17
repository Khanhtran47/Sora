/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { Image as NextImage, Row, Spacer } from '@nextui-org/react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Gallery, Item, type GalleryProps } from 'react-photoswipe-gallery';
import Image, { MimeType } from 'remix-image';

import { authenticate } from '~/services/supabase';
import i18next from '~/i18n/i18next.server';
import { getImages } from '~/services/tmdb/tmdb.server';

import { CACHE_CONTROL } from '~/utils/server/http';
import TMDB from '~/utils/media';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { H5 } from '~/components/styles/Text.styles';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/photos`,
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const images = await getImages('movie', mid, locale);
  if (!images) throw new Response('Not Found', { status: 404 });

  return json({ images }, { headers: { 'Cache-Control': CACHE_CONTROL.detail } });
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
    onClick: (_, __, pswpInstance) => {
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
    onInit: (_, pswpInstance) => {
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

const MoviePhotosPage = () => {
  const { images } = useLoaderData<typeof loader>();
  const movieData = useTypedRouteLoaderData('routes/movies/$movieId');
  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        display: 'flex',
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: '$sm',
          paddingRight: '$sm',
        },
      }}
    >
      <Spacer y={1} />
      {images?.backdrops && images.backdrops.length > 0 && (
        <>
          <Row justify="center" fluid>
            <H5 h5>
              <strong>Backdrops</strong>
            </H5>
          </Row>
          <Spacer y={0.5} />
          <Gallery withCaption withDownloadButton uiElements={uiElements}>
            <div className="grid grid-cols-1 justify-center gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {images?.backdrops?.map((image) => (
                <Item
                  key={image.file_path}
                  cropped
                  original={TMDB.profileUrl(image?.file_path, 'original')}
                  thumbnail={TMDB.profileUrl(image?.file_path, 'w185')}
                  alt={`Backdrop of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                  caption={`Backdrop of ${movieData?.detail?.title} size ${image.width}x${image.height}`}
                  width={image.width}
                  height={image.height}
                >
                  {({ ref, open }) => (
                    <NextImage
                      // @ts-ignore
                      as={Image}
                      src={TMDB.profileUrl(image?.file_path, 'w185')}
                      ref={ref as React.MutableRefObject<HTMLImageElement>}
                      onClick={open}
                      alt={`Backdrop of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                      containerCss={{ borderRadius: 10 }}
                      className="min-w-[120px] 2xs:min-w-[185px]"
                      css={{
                        cursor: 'pointer',
                        objectFit: 'cover',
                        height: 'auto',
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
              ))}
            </div>
          </Gallery>
          <Spacer y={1} />
        </>
      )}
      {images?.logos && images.logos.length > 0 && (
        <>
          <Row justify="center" fluid>
            <H5 h5>
              <strong>Logos</strong>
            </H5>
          </Row>
          <Spacer y={0.5} />
          <Gallery withCaption withDownloadButton uiElements={uiElements}>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {images?.logos?.map((image) => (
                <Item
                  key={image.file_path}
                  cropped
                  original={TMDB.logoUrl(image?.file_path, 'original')}
                  thumbnail={TMDB.logoUrl(image?.file_path, 'w185')}
                  alt={`Logo of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                  caption={`Logo of ${movieData?.detail?.title} size ${image.width}x${image.height}`}
                  width={image.width}
                  height={image.height}
                >
                  {({ ref, open }) => (
                    <NextImage
                      // @ts-ignore
                      as={Image}
                      src={TMDB.logoUrl(image?.file_path, 'w185')}
                      ref={ref as React.MutableRefObject<HTMLImageElement>}
                      onClick={open}
                      alt={`Logo of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                      containerCss={{ borderRadius: 10 }}
                      className="min-w-[120px] 2xs:min-w-[185px]"
                      css={{
                        cursor: 'pointer',
                        objectFit: 'cover',
                        height: 'auto',
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
              ))}
            </div>
          </Gallery>
          <Spacer y={1} />
        </>
      )}
      {images?.posters && images.posters.length > 0 && (
        <>
          <Row justify="center" fluid>
            <H5 h5>
              <strong>Posters</strong>
            </H5>
          </Row>
          <Spacer y={0.5} />
          <Gallery withCaption withDownloadButton uiElements={uiElements}>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {images?.posters?.map((image) => (
                <Item
                  key={image.file_path}
                  cropped
                  original={TMDB.profileUrl(image?.file_path, 'original')}
                  thumbnail={TMDB.profileUrl(image?.file_path, 'w185')}
                  alt={`Poster of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                  caption={`Poster of ${movieData?.detail?.title} size ${image.width}x${image.height}`}
                  width={image.width}
                  height={image.height}
                >
                  {({ ref, open }) => (
                    <NextImage
                      // @ts-ignore
                      as={Image}
                      src={TMDB.profileUrl(image?.file_path, 'w185')}
                      ref={ref as React.MutableRefObject<HTMLImageElement>}
                      onClick={open}
                      alt={`Poster of ${movieData?.detail?.title} image size ${image.width}x${image.height}`}
                      containerCss={{ borderRadius: 10 }}
                      className="min-w-[120px] 2xs:min-w-[185px]"
                      css={{
                        cursor: 'pointer',
                        objectFit: 'cover',
                        height: 'auto',
                      }}
                      loading="lazy"
                      title={movieData?.detail?.title}
                      loaderUrl="/api/image"
                      placeholder="blur"
                      options={{
                        contentType: MimeType.WEBP,
                      }}
                    />
                  )}
                </Item>
              ))}
            </div>
          </Gallery>
        </>
      )}
    </Row>
  );
};

export default MoviePhotosPage;
