import { AxiosRequestConfig } from 'axios';
// import useSWR from 'swr';
import { MediaType, TimeWindowType } from '../tmdb.types';
import axiosClient from '../http-common';

// TODO: add useSWR hook with axios fetcher https://swr.vercel.app/docs/data-fetching#axios

class Trending {
  static getTrending = (
    mediaType: MediaType,
    timeWindow: TimeWindowType,
    params: AxiosRequestConfig,
  ) => axiosClient.get(`trending/${mediaType}/${timeWindow}`, params);
}

export default Trending;
