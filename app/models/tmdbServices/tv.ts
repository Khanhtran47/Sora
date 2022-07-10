import { AxiosRequestConfig } from 'axios';
import axiosClient from '../http-common';

interface Tv {
  [key: string]: string;
}

const tvType: Tv = {
  popular: 'popular',
  top_rated: 'top_rated',
  on_the_air: 'on_the_air',
};

class Tv {
  static getList = (type: string, params: AxiosRequestConfig) => {
    axiosClient.get(`movie/${tvType[type]}`, params);
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

export default Tv;
