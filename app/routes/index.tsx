import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { Container, Text } from '@nextui-org/react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

import Trending from '../models/tmdbServices/trending';
import TMDB, { IMedia, IMediaList } from '../models/tmdb.types';

import MediaList from '../src/components/MediaList';

// interface IIndexProps {}

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const [trending, setTrending] = useState<IMedia[]>([]);
  const postFetchDataHandler = (data: any) => {
    const result: IMedia[] = [];
    data?.results.forEach((item: any) => {
      result.push({
        id: item.id,
        title: item.title || item.name || item.original_title || item.original_name,
        overview: item.overview,
        posterPath: TMDB.posterUrl(item.poster_path, 'w500'),
        backdropPath: TMDB.backdropUrl(item.backdrop_path, 'w780'),
        releaseDate: item.release_date || item.first_air_date,
        voteAverage: item.vote_average,
        voteCount: item.vote_count,
        mediaType: item.media_type,
        popularity: item.popularity,
        originalLanguage: item.original_language,
      });
    });
    return result;
  };

  useEffect(() => {
    const loadTrending = async (pageToLoad = 1) => {
      const params = {
        page: pageToLoad,
      } as AxiosRequestConfig;
      try {
        const response: IMediaList = await Trending.getTrending('all', 'day', {
          params,
        });
        console.log(response);
        setTrending(postFetchDataHandler(response));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
      }
    };
    loadTrending();
  }, []);
  return (
    // Home page
    <Container fluid>
      <MediaList listType="slider" items={trending} switchListType={false} />
    </Container>
  );
};

export default Index;
