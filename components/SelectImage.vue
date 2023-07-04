<template>
  <div>
    <v-row class="card-content">
      <v-col v-for="image in images" :key="image.id" cols="4">
        <v-card class="py-1 px-3">
          <v-checkbox
            v-model="localSelectedImages"
            :value="image.id"
            class="image-checkbox"
          ></v-checkbox>
          <v-img :src="image.image.url" :aspect-ratio="16 / 9"></v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-btn color="accent" class="ml-auto" @click.prevent="executeParentFunction"
        >選択した画像を保存</v-btn
      >
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "nuxt-property-decorator"

interface ImageUrl {
  url: string
}

interface Image {
  id: number
  image: ImageUrl
  caption: string
}

@Component({})
export default class SelectImage extends Vue {
  images: Image[] = []
  localSelectedImages: number[] = []

  @Prop({ type: Function, required: true })
  callback: Function

  @Prop({ type: Array, required: true })
  selectedImages: number[]

  @Watch("selectedImages", { immediate: true, deep: true })
  onSelectedImagesChanged() {
    this.localSelectedImages = this.selectedImages
    this.callback(this.localSelectedImages)
  }

  created() {
    this.fetchImages()
  }

  executeParentFunction() {
    this.callback(this.localSelectedImages) // 親の関数を呼び出します
  }

  async fetchImages() {
    // // 画像一覧をAPIから取得する
    const IMAGE_API = "/api/v1/images"
    const images = await this.$axios.$get(IMAGE_API)
    this.images = images.data
  }
}
</script>

<style scoped>
.card-content {
  max-height: 200px; /* 必要な高さに適宜調整してください */
  overflow-y: auto;
  background-color: #eeeeee;
}

.image-checkbox {
  margin: 0;
}
</style>
