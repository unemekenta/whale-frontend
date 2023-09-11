<template>
  <v-img :src="fmtImageUrl" :aspect-ratio="aspect" />
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
    aspect: {
      type: String,
      default: 16 / 9,
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
