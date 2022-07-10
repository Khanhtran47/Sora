import axiosClient from '../config/http-common';
import { AxiosRequestConfig } from 'axios';
import { MediaType, TimeWindowType } from '../../../models/tmdb.types';
// import useSWR from 'swr';

// TODO: add useSWR hook with axios fetcher https://swr.vercel.app/docs/data-fetching#axios

class Trending {
  static getTrending = (
    mediaType: MediaType,
    timeWindow: TimeWindowType,
    params: AxiosRequestConfig<any>,
  ) => axiosClient.get(`trending/${mediaType}/${timeWindow}`, params);
}

export default Trending;
