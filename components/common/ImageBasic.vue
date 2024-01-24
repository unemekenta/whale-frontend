<template>
  <a v-if="showExpansion" :href="fmtImageUrl" target="_blank" class="image">
    <img
      :src="fmtImageUrl"
      :width="width"
      :height="height"
      :aspect-ratio="aspectRatio"
      decoding="async"
      :alt="alt"
    />
  </a>
  <img
    v-else
    :src="fmtImageUrl"
    :width="width"
    :height="height"
    :aspect-ratio="aspectRatio"
    decoding="async"
    :alt="alt"
  />
</template>

<script lang="ts">
import Vue from "vue"
import { imageUrl } from "@/plugins/helpers/image"

export default Vue.extend({
  props: {
    src: {
      type: String,
      default: null,
      required: true,
    },
    aspectRatio: {
      type: Number,
      default: 16 / 9,
      required: false,
    },
    alt: {
      type: String,
      default: "",
      required: false,
    },
    width: {
      type: Number,
      default: 600,
      required: false,
    },
    height: {
      type: Number,
      default: 600,
      required: false,
    },
    showExpansion: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  computed: {
    fmtImageUrl() {
      return imageUrl(this.src)
    },
  },
})
</script>

<style lang="scss" scoped>
.image {
  display: block;
  height: 100%;
  width: 100%;
  img {
    height: 100%;
    width: 100%;
    display: inline-block;
  }
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
