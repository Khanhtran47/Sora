import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';

import i18next from '~/i18n/i18next.server';

// eslint-disable-next-line import/prefer-default-export, arrow-body-style
export const loader = async ({ request }: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  return json(
    {
      short_name: 'Sora',
      name: 'Sora',
      theme_color: '#0072F5',
      background_color: '#000000',
      display: 'standalone',
      display_override: ['standalone', 'browser', 'fullscreen'],
      description: 'An app for watching movies, anime, reading manga and more',
      start_url: '/',
      dir: 'ltr',
      scope: '/',
      lang: locale,
      orientation: 'natural',
      categories: ['books', 'entertainment', 'music', 'news', 'personalization', 'photo'],
      shortcuts: [
        {
          name: 'Movies',
          url: '/movies',
          description: 'Explore latest movies',
          icons: [
            {
              src: '/favicons/windows11/Square44x44Logo.targetsize-96.png',
              sizes: '96x96',
            },
          ],
        },
        {
          name: 'Tv Shows',
          url: '/tv-shows',
          description: 'Explore latest tv shows',
          icons: [
            {
              src: '/favicons/windows11/Square44x44Logo.targetsize-96.png',
              sizes: '96x96',
            },
          ],
        },
        {
          name: 'Anime',
          url: '/anime',
          description: 'Explore latest anime',
          icons: [
            {
              src: '/favicons/windows11/Square44x44Logo.targetsize-96.png',
              sizes: '96x96',
            },
          ],
        },
      ],
      screenshots: [
        {
          src: '/images/screenshot.png',
          type: 'image/png',
          sizes: '1901x959',
          platform: 'wide',
          label: 'Homescreen of Sora in darkmode',
        },
        {
          src: '/images/screenshot_2.png',
          type: 'image/png',
          sizes: '1280x800',
          platform: 'wide',
          label: 'Homescreen of Sora in lightmode',
        },
        {
          src: '/images/screenshot_3.png',
          type: 'image/png',
          sizes: '482x995',
          platform: 'narrow',
          label: 'Homescreen of Sora in mobile',
        },
      ],
      icons: [
        {
          src: '/favicons/windows11/SmallTile.scale-100.png',
          sizes: '71x71',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SmallTile.scale-125.png',
          sizes: '89x89',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SmallTile.scale-150.png',
          sizes: '107x107',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SmallTile.scale-200.png',
          sizes: '142x142',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SmallTile.scale-400.png',
          sizes: '284x284',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square150x150Logo.scale-100.png',
          sizes: '150x150',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square150x150Logo.scale-125.png',
          sizes: '188x188',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square150x150Logo.scale-150.png',
          sizes: '225x225',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square150x150Logo.scale-200.png',
          sizes: '300x300',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square150x150Logo.scale-400.png',
          sizes: '600x600',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Wide310x150Logo.scale-100.png',
          sizes: '310x150',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Wide310x150Logo.scale-125.png',
          sizes: '388x188',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Wide310x150Logo.scale-150.png',
          sizes: '465x225',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Wide310x150Logo.scale-200.png',
          sizes: '620x300',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Wide310x150Logo.scale-400.png',
          sizes: '1240x600',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/LargeTile.scale-100.png',
          sizes: '310x310',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/LargeTile.scale-125.png',
          sizes: '388x388',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/LargeTile.scale-150.png',
          sizes: '465x465',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/LargeTile.scale-200.png',
          sizes: '620x620',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/LargeTile.scale-400.png',
          sizes: '1240x1240',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.scale-100.png',
          sizes: '44x44',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.scale-125.png',
          sizes: '55x55',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.scale-150.png',
          sizes: '66x66',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.scale-200.png',
          sizes: '88x88',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.scale-400.png',
          sizes: '176x176',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/StoreLogo.scale-100.png',
          sizes: '50x50',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/StoreLogo.scale-125.png',
          sizes: '63x63',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/StoreLogo.scale-150.png',
          sizes: '75x75',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/StoreLogo.scale-200.png',
          sizes: '100x100',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/StoreLogo.scale-400.png',
          sizes: '200x200',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SplashScreen.scale-100.png',
          sizes: '620x300',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SplashScreen.scale-125.png',
          sizes: '775x375',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SplashScreen.scale-150.png',
          sizes: '930x450',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SplashScreen.scale-200.png',
          sizes: '1240x600',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/SplashScreen.scale-400.png',
          sizes: '2480x1200',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-20.png',
          sizes: '20x20',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-24.png',
          sizes: '24x24',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-30.png',
          sizes: '30x30',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-36.png',
          sizes: '36x36',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-40.png',
          sizes: '40x40',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-44.png',
          sizes: '44x44',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-80.png',
          sizes: '80x80',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.targetsize-256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-20.png',
          sizes: '20x20',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-24.png',
          sizes: '24x24',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-30.png',
          sizes: '30x30',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-36.png',
          sizes: '36x36',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-40.png',
          sizes: '40x40',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-44.png',
          sizes: '44x44',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-80.png',
          sizes: '80x80',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-unplated_targetsize-256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png',
          sizes: '20x20',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png',
          sizes: '24x24',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png',
          sizes: '30x30',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png',
          sizes: '36x36',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png',
          sizes: '40x40',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png',
          sizes: '44x44',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png',
          sizes: '80x80',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/favicons/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/favicons/android/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/favicons/android/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/favicons/android/android-launchericon-144-144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/favicons/android/android-launchericon-96-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/favicons/android/android-launchericon-72-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/favicons/android/android-launchericon-48-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/16.png',
          sizes: '16x16',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/favicons/ios/20.png',
          sizes: '20x20',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/29.png',
          sizes: '29x29',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/40.png',
          sizes: '40x40',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/50.png',
          sizes: '50x50',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/57.png',
          sizes: '57x57',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/58.png',
          sizes: '58x58',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/76.png',
          sizes: '76x76',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/80.png',
          sizes: '80x80',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/87.png',
          sizes: '87x87',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/100.png',
          sizes: '100x100',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/114.png',
          sizes: '114x114',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/167.png',
          sizes: '167x167',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/180.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/favicons/ios/192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/favicons/ios/256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/favicons/ios/512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/favicons/ios/1024.png',
          sizes: '1024x1024',
          type: 'image/png',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'private, max-age=604800, immutable',
      },
    },
  );
};
