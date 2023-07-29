<template>
  <v-app dark>
    <div v-if="error.statusCode === 404">
      {{ pageNotFound }}
      <v-img
        class="notfound-img"
        :src="require('@/assets/images/common/404.png')"
        :aspect-ratio="1"
      ></v-img>
    </div>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script>
export default {
  name: "EmptyLayout",
  layout: "empty",
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
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 20px;
}
.notfound-img {
  max-width: 400px;
  height: auto;
  margin: auto;
}
</style>
