import { env } from 'process';

export default class Bilibili {
  static readonly API_BASE_URL = env.BILIBILI_API_URL;

  static animeSearchUrl = (query: string): string => `${Bilibili.API_BASE_URL}${query}`;

  static animeInfoUrl = (id: number): string => `${Bilibili.API_BASE_URL}info?id=${id}`;

  static animeEpisodeUrl = (episodeId: number): string =>
    `${Bilibili.API_BASE_URL}watch?episodeId=${episodeId}`;
}
