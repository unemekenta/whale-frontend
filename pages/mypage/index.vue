<template>
  <v-container fluid>
    <div justify="justify-space-between">
      <v-row justify="justify-space-between">
        <v-col cols="6">
          <h1 class="my-5">設定</h1>
        </v-col>
        <v-col cols="6" class="my-auto">
          <v-row justify="end">
            <v-btn color="primary" variant="outlined" class="ma-3" @click="userLogout">
              ログアウト
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-row justify="end">
          <div v-if="displaySuccessModal" class="ma-3">
            <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
          </div>
          <div v-if="displayErrorModal" class="ma-3">
            <ErrorAlert :txt="errorModalTxt" />
          </div>
        </v-row>
      </v-col>
      <v-col cols="12">
        <SettingUserInfo :user-info-form="user" :callback-func="submitUserInfoForm" />
      </v-col>
    </div>
    <nuxt-link :to="'/mypage/comments'"> コメント一覧 </nuxt-link>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { User } from "@/@types/common"
import { isSuccessResponse } from "@/plugins/axios-accessor"
import SettingUserInfo from "@/components/SettingUserInfo.vue"

export default Vue.extend({
  components: {
    SettingUserInfo,
  },
  middleware: "authenticated",
  data() {
    return {
      user: {
        id: 0,
        name: "",
        nickname: "",
        image: {
          url: "",
        },
        introduction: "",
      } as User,

      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "",
    }
  },

  created() {
    this.sessionCheck()
  },

  // フロント側でログイン状態に変更するにはsetLoginをtrueにする
  methods: {
    async sessionCheck() {
      try {
        const USER_API = "/api/v1/auth/sessions"
        const response = await this.$axios.$get(USER_API)
        if (isSuccessResponse(response)) {
          this.user.id = response.data.id
          this.user.name = response.data.name
          this.user.nickname = response.data.nickname
          this.user.image = response.data.image
          this.user.introduction = response.data.introduction
          return
        }
        throw new Error("ログイン情報取得エラー")
      } catch (error) {
        this.userLogout()
      }
    },

    async userLogout() {
      localStorage.removeItem("access-token")
      localStorage.removeItem("client")
      localStorage.removeItem("uid")
      localStorage.removeItem("token-type")
      await this.$router.push("/login")
    },

    async submitUserInfoForm(params: URLSearchParams, formData: FormData) {
      const EDIT_USER_API = "/api/v1/auth/"
      try {
        if (formData.get("image") === null) {
          formData.delete("image")
        }
        await this.$axios.$put(EDIT_USER_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params,
        })
        this.successModalTxt = "ユーザー情報を更新しました。"
        this.displaySuccessModal = true
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
      } catch (error) {
        this.errorModalTxt = "更新に失敗しました。"
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },
  },
})
</script>
