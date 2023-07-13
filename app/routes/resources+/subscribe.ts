/* eslint-disable no-console */
import type { ActionArgs } from '@remix-run/node';
import webPush from 'web-push';

import { SaveSubscription } from '~/utils/server/pwa-utils.server';

export const action = async ({ request }: ActionArgs) => {
  const data = await request.json();
  const { subscription } = data;

  SaveSubscription(subscription);

  return { message: 'Done' };
};

export const loader = async () => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
      'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
        'environment variables. You can use the following ones:',
    );
    console.log(webPush.generateVAPIDKeys());
    return;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;

  return new Response(publicKey, {
    status: 202,
    statusText: 'Successful Operation',
  });
};
