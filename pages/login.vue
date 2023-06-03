<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="$auth.loggedIn" cols="12">
        <h1 class="my-5">設定</h1>
        <v-btn variant="outlined" @click="userLogout"> ログアウト </v-btn>
      </v-col>
      <v-col v-else cols="12">
        <h2 class="my-5">ログイン</h2>
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
      </v-col>
    </v-row>
    <Modal ref="modal" />
    <ImageUploader class="my-3"></ImageUploader>
    <ImageList class="my-3"></ImageList>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import Modal from "@/components/Modal.vue"

interface User {
  nickname: string
  image: string
}

@Component
export default class Login extends Vue {
  user: User = {
    nickname: "",
    image: "",
  }

  form = {
    email: "",
    password: "",
  }

  async userLogin() {
    try {
      const response: any = await this.$auth.loginWith("local", { data: this.form })
      if (response.data && response.data.success === false) {
        ;(this.$refs.modal as Modal).open("エラー", "ログインに失敗しました")
        this.userLogout()
        throw new Error("ログインエラー")
      }
      await this.getUserInfo()
      await this.$auth.fetchUser()
    } catch (error) {}
  }

  async getUserInfo() {
    try {
      const USER_API = "/api/v1/auth/sessions"
      const response = await this.$axios.$get(USER_API)
      if (response.data && !response.data.error) {
        this.$auth.setUser(response.$data)
      } else {
        throw new Error("ログイン情報取得エラー")
      }
    } catch (error) {
      throw new Error(error + " ユーザー情報の取得に失敗しました。")
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
}
</script>
