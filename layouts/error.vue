<template>
  <v-app dark>
    <div v-if="error.statusCode === 404">
      {{ pageNotFound }}
      <ImageBasic
        class="notfound-img"
        :src="require('@/assets/images/common/404.png')"
        :aspect-ratio="1"
      />
    </div>
    <h1 v-else>
      {{ otherError }}
      <ImageBasic
        class="notfound-img"
        :src="require('@/assets/images/common/500.png')"
        :aspect-ratio="1"
      />
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script>
import Vue from "vue"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
})
</script>

<style lang="scss" scoped>
h1 {
  font-size: $font-super-large;
}
.notfound-img {
  max-width: 400px;
  height: auto;
  margin: auto;
}
</style>
