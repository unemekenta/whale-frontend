<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12">
        <h1>ログイン</h1>
      </v-col>
    </v-row>
    <v-row justify="end">
      <div v-if="displaySuccessModal" class="ma-3">
        <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
      </div>
      <div v-if="displayErrorModal" class="ma-3">
        <ErrorAlert :txt="errorModalTxt" />
      </div>
    </v-row>
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
      <nuxt-link :to="'/signup'"></nuxt-link>
      <div class="text-center">
        <v-btn class="primary" @click.prevent="userLogin">ログイン</v-btn>
      </div>
    </v-form>
    <div class="text-center">
      <nuxt-link :to="'/signup'">新規登録はこちら</nuxt-link>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { logoutStorage } from "@/plugins/session"
import { signInForm } from "@/@types/user"
import { isSuccessResponse, errorMessage } from "@/plugins/axios-accessor"

interface Data {
  // user: User
  form: signInForm
  displaySuccessModal: boolean
  successModalTxt: string
  displayErrorModal: boolean
  errorModalTxt: string
}

export default Vue.extend({
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "エラーが発生しました",
    } as Data
  },
  methods: {
    async created() {
      await this.sessionCheck()
    },
    async userLogin() {
      try {
        const SIGN_IN_API = "/api/v1/auth/sign_in"
        const response = await this.$axios.$post(SIGN_IN_API, this.form)
        if (isSuccessResponse(response)) {
          this.$router.push("/")
        } else {
          await this.userLogout()
          this.errorModalTxt = errorMessage(response)
          throw new Error("ログインエラー")
        }
      } catch (error) {
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },
    async sessionCheck() {
      try {
        const USER_API = "/api/v1/auth/sessions"
        const response = await this.$axios.$get(USER_API)
        if (isSuccessResponse(response)) {
          this.$router.push("/")
        }
      } catch (error) {
        this.userLogout()
      }
    },
    userLogout() {
      logoutStorage()
    },
  },
})
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
