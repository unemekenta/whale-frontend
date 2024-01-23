<template>
  <v-container fluid>
    <v-row>
      <h1 class="my-5">画像フォルダ</h1>
    </v-row>
    <ImageUploader class="my-3"></ImageUploader>
    <ImageList class="my-3"></ImageList>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  middleware: "authenticated",
})
</script>
