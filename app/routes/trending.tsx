import React, { useState, useEffect } from 'react';
import { Container, Pagination, Spacer, Radio } from '@nextui-org/react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import TMDB, { IMedia, IMediaList } from '../models/tmdb.types';

/* API */
// import { getTrending } from '~/src/models/tmdb.server';
import Trending from '../models/tmdbServices/trending';

/* Components */
import MediaList from '../src/components/MediaList';

// How this page load data:
// First load (mount): using useLoaderData (server loaded)
// After: client side
// TODO: choose the best strategy to load data (better for SEO, for user ex)
// and choose a way to swap today trending and this week trending, or both ?
const TrendingPage = () => {
  const [trending, setTrending] = useState<IMedia[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [listName] = useState('Today Trending');

  const postFetchDataHandler = (data: any) => {
    const result: IMedia[] = [];
    data?.results.forEach((item: any) => {
      result.push({
        id: item.id,
        title: item.title || item.name || item.original_title || item.original_name,
        overview: item.overview,
        posterPath: TMDB.posterUrl(item.poster_path, 'w500'),
        backdropPath: TMDB.backdropUrl(item.backdrop_path),
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
    const loadTrending = async (pageToLoad: number = page) => {
      const params = {
        page: pageToLoad,
      } as AxiosRequestConfig;
      try {
        const response: IMediaList = await Trending.getTrending('all', 'day', {
          params,
        });
        console.log(response);
        setTrending(postFetchDataHandler(response));
        setTotalPages(response?.total_pages);
        setPage(pageToLoad);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
      }
    };
    loadTrending();
  }, [page]);

  // const radioChangeHandler = (value: string) => {
  //   if (value === 'today') {
  //     setTrending(todayTrending);
  //     setListName('Today Trending');
  //   } else {
  //     setTrending(weekTrending);
  //     setListName('This Week Trending');
  //   }
  // };

  const paginationChangeHandler = async (pageToLoad: number) => {
    setPage(pageToLoad);
    // TODO: look for built-in hook allowing changing url without reloading page
    window.history.pushState(null, 'tmp', `?page=${pageToLoad}`);
  };

  return (
    <Container fluid>
      {/* TODO: better and prettier way to swap trending type */}
      <Radio.Group
        orientation="horizontal"
        label="Time Windows"
        defaultValue="today"
        // onChange={radioChangeHandler}
      >
        <Radio value="today" color="secondary" size="sm">
          Today Trending
        </Radio>
        <Radio value="week" color="success" size="sm">
          This Week Trending
        </Radio>
      </Radio.Group>
      <Spacer />
      {trending?.length > 0 && (
        <MediaList listType="grid" items={trending} listName={listName} switchListType />
      )}
      <Pagination total={totalPages} initialPage={page} shadow onChange={paginationChangeHandler} />
      <Spacer />
    </Container>
  );
};

export default TrendingPage;
