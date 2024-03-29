<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12">
        <h1>新規登録</h1>
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
        v-model="signUpForm.email"
        placeholder="メールアドレス"
        outlined
        dense
        type="email"
        :error-messages="!isEmailExist ? ['メールアドレスを入力してください'] : []"
      ></v-text-field>
      <v-text-field
        v-model="signUpForm.password"
        placeholder="パスワード"
        outlined
        dense
        type="password"
        :error-messages="
          isPasswordTooShort ? [`パスワードは${passwordMinLength}文字以上で入力してください。`] : []
        "
      ></v-text-field>
      <v-text-field
        v-model="signUpForm.password_confirmation"
        placeholder="パスワード確認用"
        outlined
        dense
        type="password"
        :error-messages="isPasswordMismatch ? ['パスワードが一致しません。'] : []"
      ></v-text-field>
      <div class="text-center">
        <v-btn
          class="primary"
          :disabled="isPasswordTooShort || isPasswordMismatch || !isEmailExist"
          @click.prevent="userSignup"
          >アカウント登録</v-btn
        >
      </div>
    </v-form>
    <div class="text-center">
      <nuxt-link :to="'/login'">ログインはこちら</nuxt-link>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { signUpForm, signInForm } from "@/@types/user"
import { isSuccessResponse, errorMessage } from "@/plugins/axios-accessor"

interface Data {
  signUpForm: signUpForm
  passwordMinLength: number
  displaySuccessModal: boolean
  successModalTxt: string
  displayErrorModal: boolean
  errorModalTxt: string
  loginForm: signInForm
}

export default Vue.extend({
  data() {
    return {
      signUpForm: {
        email: "",
        password: "",
        password_confirmation: "",
      },
      passwordMinLength: 6,
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "エラーが発生しました",
      loginForm: {
        email: "",
        password: "",
      },
    } as Data
  },

  computed: {
    isEmailExist() {
      return this.signUpForm.email.length > 0
    },
    isPasswordTooShort() {
      return this.signUpForm.password.length < this.passwordMinLength
    },
    isPasswordMismatch() {
      return this.signUpForm.password !== this.signUpForm.password_confirmation
    },
  },

  methods: {
    async userSignup() {
      try {
        const SIGN_UP_API = "/api/v1/auth"
        const response = await this.$axios.$post(SIGN_UP_API, this.signUpForm)
        if (isSuccessResponse(response)) {
          alert("新規登録に成功しました。作成したアカウントでログインしてください")
          this.$router.push("/login")
        } else {
          this.errorModalTxt = errorMessage(response)
          throw new Error("アカウント登録エラー")
        }
      } catch (error) {
        this.displayErrorModal = true
      }
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
