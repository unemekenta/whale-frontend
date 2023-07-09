<template>
  <v-form ref="form" class="mx-9">
    <v-row justify="justify-space-between">
      <v-col cols="12" md="2">
        <v-avatar size="100" class="mb-3 avatar">
          <v-img
            v-if="userInfoForm.image"
            :src="userInfoForm.image"
            :aspect-ratio="16 / 9"
            alt="avatarImage"
            class="avatar-image"
          />
          <v-img
            v-else
            :src="require('@/assets/images/common/icon-user.png')"
            :aspect-ratio="16 / 9"
            alt="avatarImage"
            class="avatar-image"
          />
        </v-avatar>
      </v-col>
      <v-col cols="12" md="10">
        <v-text-field
          v-model="userInfoForm.name"
          placeholder="名前"
          label="name"
          outlined
          dense
        ></v-text-field>
        <v-text-field
          v-model="userInfoForm.nickname"
          placeholder="ニックネーム"
          label="nickname"
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- <p class="pointer" @click="forgetPw">パスワードを忘れた方</p> -->
    <div class="text-center">
      <v-btn class="primary" @click.prevent="submitUserInfo()">保存</v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

interface UserInfoForm {
  id: number
  name: string
  nickname: string
  image: string
}

@Component
export default class SettingUserInfo extends Vue {
  @Prop({ type: Object, required: true })
  userInfoForm: UserInfoForm

  @Prop({ type: Function, required: true })
  callback: Function

  userInfoSubmitForm: UserInfoForm = {
    id: 0,
    name: "",
    nickname: "",
    image: "",
  }

  submitUserInfo() {
    // フォームの入力内容を親コンポーネントに送信する
    const uid = window.localStorage.getItem("uid")
    if (uid === null) {
      return
    }

    try {
      this.userInfoSubmitForm = this.userInfoForm
      this.callback(this.userInfoSubmitForm)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
