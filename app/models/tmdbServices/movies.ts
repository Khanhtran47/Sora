import { AxiosRequestConfig } from 'axios';
import axiosClient from '../http-common';

interface Movie {
  [key: string]: string;
}

const movieType: Movie = {
  upcoming: 'upcoming',
  popular: 'popular',
  top_rated: 'top_rated',
};

class Movies {
  static getList = (type: string, params: AxiosRequestConfig) => {
    axiosClient.get(`movie/${movieType[type]}`, params);
  };

  static getDetail = (id: number, params: AxiosRequestConfig) => {
    axiosClient.get(`movie/${id}`, params);
  };

  static getVideos = (id: number, params: AxiosRequestConfig) => {
    axiosClient.get(`movie/${id}/videos`, params);
  };

  static getCredits = (id: number, params: AxiosRequestConfig) => {
    axiosClient.get(`movie/${id}/credits`, params);
  };

  static getSimilar = (id: number, params: AxiosRequestConfig) => {
    axiosClient.get(`movie/${id}/similar`, params);
  };
}

export default Movies;
