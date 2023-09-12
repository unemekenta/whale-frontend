<template>
  <v-form ref="form">
    <v-row justify="justify-space-between">
      <v-col cols="12" md="2">
        <v-row class="justify-center">
          <v-avatar size="100" class="mb-3 avatar">
            <ImageBasic
              v-if="userInfoForm.image"
              :src="userInfoForm.image"
              :aspect-ratio="16 / 9"
              alt="avatarImage"
              class="avatar-image"
            />
            <ImageBasic
              v-else
              :src="require('@/assets/images/common/icon-user.png')"
              :aspect-ratio="16 / 9"
              alt="avatarImage"
              class="avatar-image"
            />
          </v-avatar>
        </v-row>
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
import Vue from "vue"
import ImageBasic from "@/components/common/ImageBasic.vue"

interface UserInfoForm {
  id: number
  name: string
  nickname: string
  image: string
}

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    userInfoForm: {
      type: Object,
      required: true,
    },
    callbackFunc: {
      type: Function,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      userInfoSubmitForm: {
        id: 0,
        name: "",
        nickname: "",
        image: "",
      } as UserInfoForm,
    }
  },
  methods: {
    submitUserInfo() {
      // フォームの入力内容を親コンポーネントに送信する
      const uid = window.localStorage.getItem("uid")
      if (uid === null) {
        return
      }

      try {
        this.userInfoSubmitForm = this.userInfoForm
        this.callbackFunc(this.userInfoSubmitForm)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>
