<template>
  <v-container fluid>
    <h2>画像一覧</h2>
    <v-col cols="12" md="6">
      <v-row>
        <div v-if="displaySuccessModal" class="ma-3">
          <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
        </div>
        <div v-if="displayErrorModal" class="ma-3">
          <ErrorAlert :txt="errorModalTxt" />
        </div>
      </v-row>
    </v-col>
    <v-row>
      <v-col v-for="image in images" :key="image.id" cols="6" md="3">
        <v-card class="py-1 px-3">
          <v-card-actions>
            <v-icon class="row justify-end" @click="deleteImage(image)">mdi-delete-forever</v-icon>
          </v-card-actions>
          <ImageBasic :src="image.image.url" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { Image } from "@/@types/common"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  async asyncData({ $axios }) {
    const IMAGE_API = "/api/v1/images"
    const images = await $axios.$get(IMAGE_API)
    return {
      images: images.data,
    }
  },
  data() {
    return {
      images: [] as Image[],
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "エラーが発生しました",
    }
  },
  created() {
    this.fetchImages()
  },
  methods: {
    async deleteImage(image: Image) {
      const DELETE_IMAGE_API = "/api/v1/images/" + image.id
      try {
        const response = await this.$axios.$delete(DELETE_IMAGE_API)
        this.successModalTxt = response.data.caption + "を削除しました。"
        this.displaySuccessModal = true
        this.fetchImages()
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
      } catch (error) {
        this.errorModalTxt = "削除に失敗しました。"
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },
    async fetchImages() {
      // // 画像一覧をAPIから取得する
      const IMAGE_API = "/api/v1/images"
      const images = await this.$axios.$get(IMAGE_API)
      this.images = images.data.images
    },
  },
})
</script>
