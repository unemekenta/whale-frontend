<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="6">
        <h1>ログイン</h1>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row justify="end">
      <div v-if="displaySuccessModal" class="ma-3">
        <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
      </div>
      <div v-if="displayErrorModal" class="ma-3">
        <ErrorAlert :txt="errorModalTxt" />
      </div>
    </v-row>
    <v-row>
      <v-form ref="form" class="form mx-auto my-3">
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
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import Modal from "@/components/Modal.vue"
import { User } from "@/@types/common"
import { logoutStorage } from "@/plugins/session"

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
    await this.sessionCheck()
  }

  async userLogin() {
    try {
      const response: any = await this.$auth.loginWith("local", { data: this.form })
      if (response.data && response.data.success === false) {
        ;(this.$refs.modal as Modal).open("エラー", "ログインに失敗しました")
        this.userLogout()
        throw new Error("ログインエラー")
      }
      await this.sessionCheck()
      await this.$auth.fetchUser()
      this.$router.push("/")
    } catch (error) {
      this.errorModalTxt = "ログインに失敗しました。"
      this.displayErrorModal = true
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }

  // フロント側でログイン状態に変更するにはsetLoginをtrueにする
  async sessionCheck() {
    try {
      const USER_API = "/api/v1/auth/sessions"
      const response = await this.$axios.$get(USER_API)
      if (response.data && !response.data.error) {
        const info = {
          id: response.data.id,
          name: response.data.name,
          nickname: response.data.nickname,
          image: response.data.image,
        }
        this.$auth.setUser(info)
        this.user.id = response.data.id
        this.user.name = response.data.name
        this.user.nickname = response.data.nickname
        this.user.image = response.data.image
      } else {
        this.userLogout()
      }
    } catch (error) {}
  }

  async userLogout() {
    await this.$auth.logout().then(() => {
      this.user = {
        id: 0,
        name: "",
        nickname: "",
        image: "",
      }
      logoutStorage()
    })
    await this.$auth.fetchUser()
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  max-width: 400px;
  @media screen and (max-width: $breakpoint-md) {
    max-width: calc(100% - 16px);
  }
}
</style>
