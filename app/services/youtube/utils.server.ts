import { env } from 'process';

export default class Youtube {
  static readonly API_BASE_URL = env.YOUTUBE_API_URL;

  static readonly key = process.env.YOUTUBE_API_KEY;

  static videoDetailUrl = (id: string, contentDetails?: boolean, snippet?: boolean): URL => {
    let url = `${Youtube.API_BASE_URL}videos?id=${id}&key=${Youtube.key}`;
    if (contentDetails) {
      url += '&part=contentDetails';
    }
    if (snippet) {
      url += '&part=snippet';
    }
    return new URL(url);
  };
}
