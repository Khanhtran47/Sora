import http from '../config/http-common';
import { AxiosRequestConfig } from 'axios';

interface Tv {
  [key: string]: string;
}

const tvType: Tv = {
  popular: 'popular',
  top_rated: 'top_rated',
  on_the_air: 'on_the_air',
};

class Tv {
  static getList = (type: string, params: AxiosRequestConfig<any>) => {
    http().get(`movie/${tvType[type]}`, params);
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

export default Tv;
