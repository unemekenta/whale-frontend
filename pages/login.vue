<template>
  <v-container fluid>
    <v-form class="mx-9" ref="form">
      <v-text-field
        placeholder="メールアドレス"
        outlined
        dense
        type="email"
        v-model="form.email"
      ></v-text-field>
      <v-text-field
        placeholder="パスワード"
        outlined
        dense
        type="password"
        v-model="form.password"
      ></v-text-field>
      <!-- <p class="pointer" @click="forgetPw">パスワードを忘れた方</p> -->
      <div class="text-center">
        <v-btn @click="userLogin" class="primary">ログイン</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

interface User {
  nickname: string;
  image: string;
}

@Component
export default class Login extends Vue {
  user: User = {
    nickname: "",
    image: ""
  };

  form = {
    email: "",
    password: ""
  };


  async userLogin() {
    await this.$auth.loginWith('local', { data: this.form })
    .then(() => {
      this.getUserInfo()
    })
  }

  async getUserInfo() {
    const USER_API = "/api/v1/auth/sessions"
    return this.$axios.$get(USER_API)
    .then((response) => {
      this.$auth.setUser(response.$data)
    })
  }
}

</script>