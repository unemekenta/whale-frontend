<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="$auth.loggedIn" cols="12">
        <h1 class="my-5">画像フォルダ</h1>
      </v-col>
    </v-row>
    <ImageUploader class="my-3"></ImageUploader>
    <ImageList class="my-3"></ImageList>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Images extends Vue {}
</script>
