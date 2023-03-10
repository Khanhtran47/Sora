/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */

import { renderAsync } from '@resvg/resvg-js';

const generateSvg = async ({ title, cover }: { title: string; cover: string }) => {
  const res = await fetch(
    'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff',
  );
  const font = await res.arrayBuffer();
  const { default: satori } = await import('satori');
  return satori(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        fontSize: 96,
        letterSpacing: -2,
        fontWeight: 700,
        textAlign: 'center',
        gap: 36,
      }}
    >
      <div
        style={{
          width: '1200px',
          height: '600px',
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          zIndex: '0',
          filter: 'blur(14px) saturate(120%) brightness(120%)',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: '0',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />
      <img
        src="https://raw.githubusercontent.com/Khanhtran47/Sora/master/app/assets/images/logo_loading.png"
        height={150}
        width={150}
        alt="logo"
        style={{
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          backgroundImage:
            'linear-gradient(112deg, rgb(6,183,219) -63.59%, rgb(255,78,205) -20.3%, rgb(0,114,245) 70.46%)',
          backgroundClip: 'text',
          // @ts-ignore
          '-webkit-background-clip': 'text',
          color: 'transparent',
          fontFamily: 'Inter',
        }}
      >
        {title}
      </div>
    </div>,
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Inter',
          data: font,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
};

const generateMovieSvg = async ({
  title = '',
  cover = '',
  poster = '',
  voteAverage = 0,
  genres = [],
  releaseYear,
  numberOfEpisodes,
  numberOfSeasons,
  runtime,
  productionCompany,
}: {
  title?: string;
  cover?: string;
  poster?: string;
  voteAverage?: number | string;
  genres?:
    | {
        id?: number | undefined;
        name?: string | undefined;
      }[]
    | undefined;
  releaseYear?: number;
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  runtime?: number | null;
  productionCompany?: string;
}) => {
  const res = await fetch(
    'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff',
  );
  const font = await res.arrayBuffer();

  const { default: satori } = await import('satori');
  const color = '#0072F5';
  return satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          width: '1200px',
          height: '620px',
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: -10,
          left: -200,
          zIndex: '0',
          filter: 'blur(14px) saturate(120%) brightness(120%)',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: '0',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />
      <div
        style={{
          width: 800,
          height: '100%',
          position: 'absolute',
          zIndex: '1',
          top: 0,
          left: 0,
          padding: '30px 0 50px 50px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3
          style={{
            backgroundImage:
              'linear-gradient(112deg, rgb(6,183,219) -63.59%, rgb(255,78,205) -20.3%, rgb(0,114,245) 70.46%)',
            backgroundClip: 'text',
            // @ts-ignore
            '-webkit-background-clip': 'text',
            color: 'transparent',
            fontFamily: 'Inter',
            fontSize: 28,
            marginBottom: 0,
          }}
        >
          SORA
        </h3>
        <h4
          style={{
            color: 'rgba(236,237,238,0.6)',
            fontSize: 20,
            marginBottom: 0,
            fontFamily: 'Inter',
          }}
        >
          {releaseYear ? `${releaseYear}` : null}
          <div style={{ marginRight: 10 }} />
          {runtime ? `• ${runtime} min` : null}
          {numberOfEpisodes && numberOfSeasons ? (
            <>
              {`• ${numberOfSeasons} seasons`}
              <div style={{ marginRight: 10 }} />
              {`• ${numberOfEpisodes} episodes`}
            </>
          ) : null}
        </h4>
        <h1
          style={{
            color: '#ECEDEE',
            fontSize: 50,
            width: '90%',
            marginBottom: 0,
            fontFamily: 'Inter',
          }}
        >
          {title.length > 80 ? `${title.substring(0, 80)}...` : title}
        </h1>
        <h4
          style={{
            fontWeight: 500,
            color,
            fontSize: 24,
            marginBottom: 0,
            marginTop: 10,
            fontFamily: 'Inter',
          }}
        >
          {productionCompany}
        </h4>
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            alignItems: 'center',
            marginTop: 'auto',
            gap: 5,
            marginBottom: 15,
            fontWeight: 600,
            color: 'white',
            fill: color,
            fontFamily: 'Inter',
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9185 14.3201C17.6595 14.5711 17.5405 14.9341 17.5995 15.2901L18.4885 20.2101C18.5635 20.6271 18.3875 21.0491 18.0385 21.2901C17.6965 21.5401 17.2415 21.5701 16.8685 21.3701L12.4395 19.0601C12.2855 18.9781 12.1145 18.9341 11.9395 18.9291H11.6685C11.5745 18.9431 11.4825 18.9731 11.3985 19.0191L6.96851 21.3401C6.74951 21.4501 6.50151 21.4891 6.25851 21.4501C5.66651 21.3381 5.27151 20.7741 5.36851 20.1791L6.25851 15.2591C6.31751 14.9001 6.19851 14.5351 5.93951 14.2801L2.32851 10.7801C2.02651 10.4871 1.92151 10.0471 2.05951 9.65011C2.19351 9.25411 2.53551 8.96511 2.94851 8.90011L7.91851 8.17911C8.29651 8.14011 8.62851 7.91011 8.79851 7.57011L10.9885 3.08011C11.0405 2.98011 11.1075 2.88811 11.1885 2.81011L11.2785 2.74011C11.3255 2.68811 11.3795 2.64511 11.4395 2.61011L11.5485 2.57011L11.7185 2.50011H12.1395C12.5155 2.53911 12.8465 2.76411 13.0195 3.10011L15.2385 7.57011C15.3985 7.89711 15.7095 8.12411 16.0685 8.17911L21.0385 8.90011C21.4585 8.96011 21.8095 9.25011 21.9485 9.65011C22.0795 10.0511 21.9665 10.4911 21.6585 10.7801L17.9185 14.3201Z"
              fill={color}
            />
          </svg>
          <span>{voteAverage}</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            width: '90%',
            flexWrap: 'wrap',
          }}
        >
          {genres?.map((genre) => (
            <div
              style={{
                background: 'rgba(80, 80, 80, 0.4)',
                padding: '4px 15px',
                fontSize: 20,
                borderRadius: 50,
                color: 'white',
                fontWeight: 200,
                fontFamily: 'Inter',
              }}
              key={genre.id}
            >
              {genre.name?.replace(/[&\\/\\#,+()$~%.'":*?<>{}]/g, ' ')}
            </div>
          ))}
        </div>
      </div>
      <img
        src={poster}
        alt="poster"
        style={{
          width: 414,
          height: 620,
          position: 'absolute',
          objectFit: 'cover',
          zIndex: '1',
          top: 0,
          right: 0,
          boxShadow: '-10px 5px 20px 0px rgba(0,0,0,0.75)',
        }}
      />
    </div>,
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Inter',
          data: font,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
};

const generatePng = async (svg: string) => {
  const image = await renderAsync(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: {
      loadSystemFonts: false,
    },
  });
  return new Response(image.asPng(), {
    headers: {
      'content-type': 'image/png',
      'cache-control':
        process.env.NODE_ENV === 'development'
          ? 'no-cache, no-store'
          : 'public, immutable, no-transform, max-age=31536000',
    },
  });
};

export { generateSvg, generateMovieSvg, generatePng };
