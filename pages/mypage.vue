<template>
  <v-container fluid>
    <div v-if="$auth.loggedIn" justify="justify-space-between">
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
    <div v-else justify="justify-space-between">
      ログインしてください
      <NuxtLink to="/login">ログインページ</NuxtLink>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { User } from "@/@types/common"

interface UserInfoForm {
  id: number
  name: string
  nickname: string
  image: string
}

@Component
export default class Mypage extends Vue {
  user: User = {
    id: 0,
    name: "",
    nickname: "",
    image: "",
  }

  displaySuccessModal = false
  successModalTxt = ""
  displayErrorModal = false
  errorModalTxt = ""

  async created() {
    await this.sessionCheck()
  }

  // フロント側でログイン状態に変更するにはsetLoginをtrueにする
  async sessionCheck() {
    try {
      const USER_API = "/api/v1/auth/sessions"
      const response = await this.$axios.$get(USER_API)
      if (response.data && !response.data.error) {
        this.user.id = response.data.id
        this.user.name = response.data.name
        this.user.nickname = response.data.nickname
        this.user.image = response.data.image
        return
      }
      throw new Error("ログイン情報取得エラー")
    } catch (error) {
      this.userLogout()
    }
  }

  async userLogout() {
    await this.$auth.logout().then(() => {
      this.user = {
        id: 0,
        name: "",
        nickname: "",
        image: "",
      }
      localStorage.removeItem("access-token")
      localStorage.removeItem("client")
      localStorage.removeItem("uid")
      localStorage.removeItem("token-type")
    })
    await this.$auth.fetchUser()
  }

  async submitUserInfoForm(userInfoForm: UserInfoForm) {
    const EDIT_USER_API = "/api/v1/auth/"
    try {
      await this.$axios.$put(EDIT_USER_API, userInfoForm)
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
  }
}
</script>
