<template>
  <a :href="fmtImageUrl" target="_blank" class="image">
    <v-img :src="fmtImageUrl" :aspect-ratio="aspectRatio" decoding="async" :alt="alt" />
  </a>
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
  },
  computed: {
    fmtImageUrl() {
      return imageUrl(this.src)
    },
  },
})
</script>

<style>
.image {
  display: block;
  height: 100%;
  width: 100%;
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
