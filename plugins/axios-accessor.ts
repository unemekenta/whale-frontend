import { Plugin } from '@nuxt/types';
import { initializeAxios } from '~/utils/api';
import { AxiosResponse, AxiosError } from 'axios';

export const accessor: Plugin = ({ $axios }): void => {
  initializeAxios($axios);

  $axios.onRequest(config => {
    config.headers.client = window.localStorage.getItem("client")
    config.headers["access-token"] = window.localStorage.getItem("access-token")
    config.headers.uid = window.localStorage.getItem("uid")
    config.headers["token-type"] = window.localStorage.getItem("token-type")
  })

  $axios.onResponse(response => {
    if (response.headers.client) {
      localStorage.setItem("access-token", response.headers["access-token"])
      localStorage.setItem("client", response.headers.client)
      localStorage.setItem("uid", response.headers.uid)
      localStorage.setItem("token-type", response.headers["token-type"])
    }
  })

  // エラー処理共通化
  $axios.onError((error: AxiosError) => {
    return Promise.resolve(error.response)
  });
};

export default accessor;
