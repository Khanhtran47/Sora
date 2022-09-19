export default class Youtube {
  static readonly API_BASE_URL = 'https://www.googleapis.com/youtube/v3/';

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
