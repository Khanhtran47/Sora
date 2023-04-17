/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { Image as NextImage, Row, Spacer } from '@nextui-org/react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Gallery, Item, type GalleryProps } from 'react-photoswipe-gallery';
import Image, { MimeType } from 'remix-image';

import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';
import { getTvSeasonImages } from '~/services/tmdb/tmdb.server';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';

import { H6 } from '~/components/styles/Text.styles';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId, seasonId } = params;
  const tid = Number(tvId);
  if (!tid) throw new Response('Not Found', { status: 404 });

  const images = await getTvSeasonImages(tid, Number(seasonId), locale);
  if (!images) throw new Response('Not Found', { status: 404 });

  return json({ images }, { headers: { 'Cache-Control': CACHE_CONTROL.detail } });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/photos`,
});

const PhotosPage = () => {
  const { images } = useLoaderData<typeof loader>();
  const tvData = useTypedRouteLoaderData('routes/tv-shows/$tvId.season.$seasonId');

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
      <Row justify="center" fluid>
        <H6 h6>
          <strong>Posters</strong>
        </H6>
      </Row>
      <Spacer y={0.5} />
      <Gallery withCaption withDownloadButton uiElements={uiElements}>
        <div className="grid grid-cols-1 justify-center gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {images?.posters?.map((image) => (
            <Item
              key={image.file_path}
              cropped
              original={TMDB.profileUrl(image?.file_path, 'original')}
              thumbnail={TMDB.profileUrl(image?.file_path, 'w185')}
              alt={`Photo of ${tvData?.detail?.name} image size ${image.width}x${image.height}`}
              caption={`Photo of ${tvData?.detail?.name} size ${image.width}x${image.height}`}
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
                  alt={`Photo of ${tvData?.detail?.name} image size ${image.width}x${image.height}`}
                  containerCss={{ borderRadius: 10 }}
                  className="min-w-[120px] 2xs:min-w-[185px]"
                  css={{
                    cursor: 'pointer',
                    objectFit: 'cover',
                    height: 'auto',
                  }}
                  title={tvData?.detail?.name}
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
    </Row>
  );
};

export default PhotosPage;
