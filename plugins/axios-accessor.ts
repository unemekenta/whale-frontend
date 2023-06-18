import { Plugin } from "@nuxt/types"
import { AxiosError } from "axios"
import { initializeAxios } from "~/utils/api"

export const accessor: Plugin = ({ $axios }): void => {
  initializeAxios($axios)

  // axiosの共通設定
  $axios.defaults.timeout = 10000

  $axios.onRequest((config) => {
    config.headers.client = window.localStorage.getItem("client")
    config.headers["access-token"] = window.localStorage.getItem("access-token")
    config.headers.uid = window.localStorage.getItem("uid")
    config.headers["token-type"] = window.localStorage.getItem("token-type")
  })

  $axios.onResponse((response) => {
    if (response.headers.client) {
      localStorage.setItem("access-token", response.headers["access-token"])
      localStorage.setItem("client", response.headers.client)
      localStorage.setItem("uid", response.headers.uid)
      localStorage.setItem("token-type", response.headers["token-type"])
    }
  })

  // レスポンスの定義
  $axios.interceptors.response.use(
    (response) => {
      // 成功したレスポンスの処理
      const responseData = response.data || {} // レスポンスデータが存在しない場合のデフォルト値を指定

      // 必要なプロパティを抽出して新しいオブジェクトを作成
      const transformedResponse = {
        message: responseData.message || "", // message プロパティ
        status: responseData.status || "", // status プロパティ
        data: responseData.data || {}, // data プロパティ
      }

      return { ...response, data: transformedResponse }
    },
    (error) => {
      // エラーレスポンスの処理
      return Promise.reject(error)
    }
  )

  // エラー処理共通化
  $axios.onError((error: AxiosError) => {
    return Promise.resolve(error.response)
  })
}

export default accessor
