<template>
  <div>
    <v-row class="card-content">
      <div v-for="image in images" :key="image.id" class="image-list">
        <div
          class="image-container"
          :class="{ selected: localSelectedImages.includes(image.id) }"
          @click="toggleSelected(image.id)"
        >
          <ImageBasic
            :src="image.image.url"
            :aspect-ratio="16 / 9"
            :show-expansion="false"
            class="image"
          />
        </div>
      </div>
    </v-row>
    <v-row>
      <v-btn color="accent" class="ml-auto" @click.prevent="executeParentFunction"
        >選択した画像を保存</v-btn
      >
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Image } from "@/@types/common"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    callbackFunc: {
      type: Function,
      required: true,
    },
    selectedImages: {
      type: Array as PropType<number[]>,
      required: true,
    },
    deleteComment: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      images: [] as Image[],
      localSelectedImages: [] as number[],
    }
  },
  watch: {
    selectedImages: {
      immediate: true, // 初期値の取得時にも呼び出す
      deep: true, // ネストされたプロパティも監視
      handler(newVal) {
        this.localSelectedImages = newVal
        this.callbackFunc(this.localSelectedImages)
      },
    },
  },
  created() {
    this.fetchImages()
  },
  methods: {
    toggleSelected(imageId: number) {
      if (this.localSelectedImages.includes(imageId)) {
        this.localSelectedImages = this.localSelectedImages.filter((id) => id !== imageId)
      } else {
        this.localSelectedImages.push(imageId)
      }
    },
    executeParentFunction() {
      this.callbackFunc(this.localSelectedImages) // 親の関数を呼び出します
    },

    async fetchImages() {
      // // 画像一覧をAPIから取得する
      const IMAGE_API = "/api/v1/images"
      const imagesRes = await this.$axios.$get(IMAGE_API)
      this.images = imagesRes.data.images
    },
  },
})
</script>

<style lang="scss" scoped>
.card-content {
  height: 200px; /* 必要な高さに適宜調整してください */
  overflow-y: auto;
  background-color: $color-gray;
  display: grid;
  gap: 2px;
  grid-template-columns: 1fr 1fr;
}
.image-list {
  width: 100%;
  height: auto;
}

.image-container {
  position: relative;
  display: block;
  border: 2px solid $color-gray;
  cursor: pointer;
  width: 100%;
  height: auto;
}

.image-container.selected {
  border-color: $color-secondary;
}

.image-container .image {
  width: 100%;
  height: auto;
}

.image-container .image img {
  object-fit: cover;
}
</style>
