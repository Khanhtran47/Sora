export default class Loklok {
  static readonly API_BASE_URL = 'https://filmhot.live/_next/data/q1Mm4aIFcpfdCi0ElfSr6/';

  static searchMediaUrl = (keyword: string): string =>
    `${Loklok.API_BASE_URL}search.json?q=${keyword}`;

  static tvDetailUrl = (id: number, episodeIndex: number): string =>
    `${Loklok.API_BASE_URL}tv/${id}/${episodeIndex - 1}.json?id=${id}&episodeIndex=${
      episodeIndex - 1
    }`;

  static movieDetailUrl = (id: number): string => `${Loklok.API_BASE_URL}movie/${id}.json?id=${id}`;
}
