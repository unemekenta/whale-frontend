import { Plugin } from "@nuxt/types"
import { AxiosError } from "axios"
import { initializeAxios } from "~/utils/api"

export const accessor: Plugin = ({ $axios }): void => {
  initializeAxios($axios)

  // axiosの共通設定
  $axios.defaults.timeout = 10000

  // onRequest,onResponse,onErrorの処理を実装
  // 成功時
  // {
  //   data: {[任意のデータ]}
  //   status: success
  // }
  // エラー時
  // {
  //   data: {[任意のデータ]}
  //   status: error
  //   errors: {[エラー内容]}
  // }

  $axios.onRequest((config) => {
    config.headers.client = window.localStorage.getItem("client")
    config.headers["access-token"] = window.localStorage.getItem("access-token")
    config.headers.uid = window.localStorage.getItem("uid")
    config.headers["token-type"] = window.localStorage.getItem("token-type")
  })

  // レスポンスがあった場合は、レスポンスヘッダーから必要な情報を取得して、ローカルストレージに保存
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

      // 必要なプロパティを抽出して新しいオブジェクトを作成
      const transformedResponse = {
        status: response.status || "", // status プロパティ
        data: response.data || {} || [], // data プロパティ
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

// 成功レスポンスかどうかの判定
export function isSuccessResponse(response: any): boolean {
  return response.data && !response.errors
}

// エラーメッセージの取得
export function errorMessage(response: any): string {
  return (
    response?.errors?.full_messages?.join(" ") ||
    response?.errors?.join(" ") ||
    "エラーが発生しました"
  )
}
