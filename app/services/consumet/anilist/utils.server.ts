import type { IMedia } from '~/types/media';

import type { IAnimeEpisode, IAnimeResult } from './anilist.types';

export const fetchAnimeResultsHandler = (data: IAnimeResult[]): IMedia[] => {
  const media: IMedia[] = [];
  data.forEach((anime) => {
    const {
      color,
      cover,
      description,
      episodes,
      genres,
      id,
      image,
      malId,
      popularity,
      rating,
      relationType,
      releaseDate,
      status,
      title,
      totalEpisodes,
      trailer,
      type,
    } = anime;
    const mediaData: IMedia = {
      backdropPath: cover,
      color,
      episodes,
      genresAnime: genres,
      id,
      malId,
      mediaType: 'anime',
      overview: description,
      popularity,
      posterPath: image,
      relationType,
      releaseDate,
      status,
      title,
      totalEpisodes,
      trailer,
      type,
      voteAverage: rating,
    };
    media.push(mediaData);
  });
  return media;
};

export const fetchAnimeEpisodeHandler = (data: IAnimeEpisode[]): IMedia[] => {
  const media: IMedia[] = [];
  data.forEach((anime) => {
    const {
      color,
      episodeId,
      episodeNumber,
      episodeTitle,
      genres,
      id,
      image,
      malId,
      rating,
      title,
      type,
    } = anime;
    const mediaData: IMedia = {
      color,
      episodeId,
      episodeNumber,
      episodeTitle,
      genresAnime: genres,
      id,
      malId,
      mediaType: 'anime',
      posterPath: image,
      title,
      type,
      voteAverage: rating,
    };
    media.push(mediaData);
  });
  return media;
};
