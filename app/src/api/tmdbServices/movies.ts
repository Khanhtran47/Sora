import http from '../config/http-common';
import { AxiosRequestConfig } from 'axios';

interface Movie {
  [key: string]: string;
}

const movieType: Movie = {
  upcoming: 'upcoming',
  popular: 'popular',
  top_rated: 'top_rated',
};

class Movies {
  static getList = (type: string, params: AxiosRequestConfig<any>) => {
    http().get(`movie/${movieType[type]}`, params);
  };

  static getDetail = (id: number, params: AxiosRequestConfig<any>) => {
    http().get(`movie/${id}`, params);
  };

  static getVideos = (id: number, params: AxiosRequestConfig<any>) => {
    http().get(`movie/${id}/videos`, params);
  };

  static getCredits = (id: number, params: AxiosRequestConfig<any>) => {
    http().get(`movie/${id}/credits`, params);
  };

  static getSimilar = (id: number, params: AxiosRequestConfig<any>) => {
    http().get(`movie/${id}/similar`, params);
  };
}

export default Movies;
