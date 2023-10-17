<template>
  <v-form ref="form">
    <v-row justify="justify-space-between">
      <v-col cols="12" md="2">
        <v-row class="justify-center">
          <v-avatar size="100" class="mb-3 avatar">
            <ImageBasic
              v-if="userInfoSubmitForm.image.url"
              :src="userInfoSubmitForm.image.url"
              :aspect-ratio="1"
              alt="avatarImage"
              class="avatar-image"
            />
            <ImageBasic
              v-else
              :src="require('@/assets/images/common/icon-user.png')"
              :aspect-ratio="1"
              alt="avatarImage"
              class="avatar-image"
            />
          </v-avatar>
          <UserImageUploader :callback-func="setSelectedFile" />
        </v-row>
      </v-col>
      <v-col cols="12" md="10">
        <v-text-field
          v-model="userInfoSubmitForm.name"
          placeholder="名前"
          label="name"
          outlined
          dense
        ></v-text-field>
        <v-text-field
          v-model="userInfoSubmitForm.nickname"
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
import UserImageUploader from "@/components/UserImageUploader.vue"

interface UserInfoForm {
  id: number
  name: string
  nickname: string
  image: {
    url: string
  }
}

export default Vue.extend({
  components: {
    ImageBasic,
    UserImageUploader,
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
        image: { url: "" },
      } as UserInfoForm,
      selectedFile: "", // 画像ファイルを保持するデータ
    }
  },
  created() {
    this.setUserInfoForm()
  },
  methods: {
    setUserInfoForm() {
      this.userInfoSubmitForm = this.userInfoForm
    },
    setSelectedFile(imageFile: string) {
      this.selectedFile = imageFile
    },
    submitUserInfo() {
      // フォームの入力内容を親コンポーネントに送信する
      const uid = window.localStorage.getItem("uid")
      if (uid === null) {
        return
      }

      try {
        let formData = new FormData()
        if (this.selectedFile) {
          formData.append("image", this.selectedFile)
        }
        const params = new URLSearchParams()
        params.append("name", this.userInfoSubmitForm.name)
        params.append("nickname", this.userInfoSubmitForm.nickname)
        this.callbackFunc(params, formData)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>
