import { env, exit } from 'process';

// server global config
interface ISGConfigs {
  /**
   * see if lru-caching is turned ON(true)/OFF(false)
   * default ON (true)
   */
  __lruCache: boolean;
  /**
   * required login for every routes in app
   * default true
   */
  __globalAuthRequired: boolean;
  /**
   * required invite code to sign up new account
   * default true
   */
  __invitedSignUpOnly: boolean;
  /**
   * invited sign-up key
   * this key should be changed once in a while
   */
  __invitedSignUpKey: string;
  /**
   * turn on/off loklok provider
   * default false for development
   */
  __loklokProvider: boolean;
  /**
   * turn on/off bilibli provider
   * default false for development
   */
  __bilibiliProvider: boolean;
  /**
   * turn on/off kisskh provider
   * default false for development
   */
  __kisskhProvider: boolean;
}

const sgConfigs: ISGConfigs = {
  __lruCache: env.NODE_ENV === 'production' || env.LRU_CACHE !== 'OFF',
  __globalAuthRequired: !(env.GLOBAL_AUTH_REQUIRED === 'OFF'),
  __invitedSignUpOnly: !(env.INVITED_SIGNUP_ONLY === 'OFF'),
  __invitedSignUpKey: env.INVITED_SIGNUP_KEY || '',
  __loklokProvider: env.LOKLOK_PROVIDER === 'ON',
  __bilibiliProvider: env.BILIBILI_PROVIDER === 'ON',
  __kisskhProvider: env.KISSKH_PROVIDER === 'ON',
};

if (sgConfigs.__invitedSignUpOnly && !sgConfigs.__invitedSignUpKey) {
  console.error('Invited key is needed for Invited SignUp Only Mode');
  exit();
}

export default sgConfigs;
