<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" v-if="$auth.loggedIn">
        <h1 class="my-5">Logout</h1>
        <v-btn variant="outlined" @click="userLogout">
          ログアウト
        </v-btn>
      </v-col>
      <v-col cols="12" v-else>
        <h1 class="my-5">Login</h1>
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
      </v-col>
    </v-row>
    <Modal ref="modal" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Modal from '@/components/Modal.vue';


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
    try {
      const response: any = await this.$auth.loginWith('local', { data: this.form })
      if (response.data && response.data.success === false) {
        (this.$refs.modal as Modal).open('エラー', 'ログインに失敗しました');
        this.userLogout();
        throw new Error('ログインエラー');
      }
      await this.getUserInfo();
      await this.$auth.fetchUser();
    } catch (error) {
      console.error(error);
    }
  }

  async getUserInfo() {
    try {
      const USER_API = "/api/v1/auth/sessions";
      const response = await this.$axios.$get(USER_API)
      if (response.data && !response.data.error) {
        this.$auth.setUser(response.$data);
      } else {
        throw new Error('ログイン情報取得エラー')
      }
    } catch (error) {
      throw new Error(error + ' ユーザー情報の取得に失敗しました。')
    }
  }

  async userLogout() {
    await this.$auth.logout()
      .then(
        ()=>{
          localStorage.removeItem("access-token")
          localStorage.removeItem("client")
          localStorage.removeItem("uid")
          localStorage.removeItem("token-type")
        }
      );
    await this.$auth.fetchUser();
  }
}

</script>