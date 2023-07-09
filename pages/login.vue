<template>
  <v-container fluid>
    <div v-if="$auth.loggedIn" justify="justify-space-between">
      <v-row justify="justify-space-between">
        <v-col cols="12" md="6">
          <h1 class="my-5">設定</h1>
        </v-col>
        <v-col cols="12" md="6">
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
        <SettingUserInfo class="my-9" :user-info-form="user" :callback="submitUserInfoForm" />
      </v-col>
    </div>
    <div v-else justify="justify-space-between">
      <v-col cols="12" md="6">
        <h2 class="my-5">ログイン</h2>
      </v-col>
      <v-form ref="form" class="mx-9">
        <v-text-field
          v-model="form.email"
          placeholder="メールアドレス"
          outlined
          dense
          type="email"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          placeholder="パスワード"
          outlined
          dense
          type="password"
        ></v-text-field>
        <!-- <p class="pointer" @click="forgetPw">パスワードを忘れた方</p> -->
        <div class="text-center">
          <v-btn class="primary" @click="userLogin">ログイン</v-btn>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import Modal from "@/components/Modal.vue"

interface User {
  id: number
  name: string
  nickname: string
  image: string
}

interface UserInfoForm {
  id: number
  name: string
  nickname: string
  image: string
}

@Component
export default class Login extends Vue {
  user: User = {
    id: 0,
    name: "",
    nickname: "",
    image: "",
  }

  form = {
    email: "",
    password: "",
  }

  displaySuccessModal = false
  successModalTxt = ""
  displayErrorModal = false
  errorModalTxt = ""

  async created() {
    await this.sessionCheck(false)
  }

  async userLogin() {
    try {
      const response: any = await this.$auth.loginWith("local", { data: this.form })
      if (response.data && response.data.success === false) {
        ;(this.$refs.modal as Modal).open("エラー", "ログインに失敗しました")
        this.userLogout()
        throw new Error("ログインエラー")
      }
      await this.sessionCheck(true)
      await this.$auth.fetchUser()
    } catch (error) {}
  }

  // フロント側でログイン状態に変更するにはsetLoginをtrueにする
  async sessionCheck(setLogin: boolean) {
    try {
      const USER_API = "/api/v1/auth/sessions"
      const response = await this.$axios.$get(USER_API)
      if (response.data && !response.data.error) {
        if (setLogin) {
          this.$auth.setUser(response.$data)
        }
        this.user.id = response.data.id
        this.user.name = response.data.name
        this.user.nickname = response.data.nickname
        this.user.image = response.data.image
        return
      } else if (setLogin) {
        this.userLogout()
      }
      throw new Error("ログイン情報取得エラー")
    } catch (error) {
      if (setLogin) {
        throw new Error(error + " ユーザー情報の取得に失敗しました。")
      } else {
        this.userLogout()
      }
    }
  }

  async userLogout() {
    await this.$auth.logout().then(() => {
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
