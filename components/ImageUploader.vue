<template>
  <v-container fluid>
    <h2 class="my-3">画像をアップロードする</h2>
    <div v-if="displaySuccessModal" class="ma-3">
      <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
    </div>
    <div v-if="displayErrorModal" class="ma-3">
      <ErrorAlert :txt="errorModalTxt" />
    </div>
    <v-row justify="justify-space-between" class="align-center">
      <v-col cols="4">
        <v-card v-if="previewImage" outlined>
          <ImageBasic :src="previewImage" :aspect-ratio="16 / 9" />
        </v-card>
        <v-card v-else>
          <ImageBasic :src="require('@/assets/images/common/noimage.png')" :aspect-ratio="1" />
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-file-input
          ref="preview"
          v-model="selectedFile"
          label="画像を選択"
          accept="image/*"
          @change="changeFile"
        ></v-file-input>
        <v-text-field v-model="caption" label="キャプション"></v-text-field>
        <v-btn color="accent" @click="uploadImage">アップロード</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { imageUrl } from "@/plugins/helpers/image"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  data() {
    return {
      selectedFile: "", // 画像ファイルを保持するデータ
      caption: "",
      imageContentType: "",
      imageFileSize: 0,
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "",
      previewImage: null as string | null,
    }
  },
  methods: {
    changeFile(event: any): void {
      // ファイルが選択されたときに実行されるメソッド
      const file = event
      if (file) {
        this.imageContentType = file.type
        this.imageFileSize = file.size
        this.previewImage = URL.createObjectURL(file)
      } else {
        // ファイルが選択されていない場合はプレビューをクリアする
        this.previewImage = null
      }
    },

    fmtImageUrl(path: string) {
      return imageUrl(path)
    },

    async uploadImage() {
      const POST_IMAGE_API = "/api/v1/images"
      // 画像のアップロードを行うメソッド
      if (!this.selectedFile) {
        // ファイルが選択されていない場合は処理を中断
        throw new Error("ファイルが選択されていません")
      }
      try {
        const uid = window.localStorage.getItem("uid")
        if (uid === null) {
          return
        }
        // 画像はFormDataで送る
        let formData = new FormData()
        formData.append("image", this.selectedFile)
        const params = new URLSearchParams()
        params.append("image_content_type", this.imageContentType)
        params.append("image_file_size", String(this.imageFileSize))
        params.append("image_type", "1")
        params.append("caption", this.caption)
        params.append("uid", uid)

        const response = await this.$axios.$post(POST_IMAGE_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params,
        })
        this.successModalTxt = response.data.caption + "をアップロードしました。"
        this.displaySuccessModal = true
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
      } catch (error) {
        this.errorModalTxt = "アップロードに失敗しました。"
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },
  },
})
</script>
