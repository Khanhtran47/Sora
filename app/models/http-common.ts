import axios from 'axios';
import queryString from 'query-string';
import TMDB from './tmdb.types';

const axiosClient = axios.create({
  baseURL: TMDB.api_base_url,
  headers: {
    'Content-type': 'application/json',
  },
  paramsSerializer: (params) =>
    queryString.stringify({
      ...params,
      api_key: window.ENV.TMDB_API_KEY,
    }),
});

axiosClient.interceptors.request.use(async (config) => config);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    throw error;
  },
);

export default axiosClient;
