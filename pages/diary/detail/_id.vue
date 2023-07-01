<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>{{ diary.title }}</h1>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <p class="my-3 text-right">
      <small>{{ fmtDateWithoutTime(diary.date) }}</small>
    </p>
    <p class="text-body-2">{{ diary.content }}</p>
    <v-row>
      <v-col v-for="image in diary.images" :key="image.id" cols="4">
        <v-card class="py-1 px-3">
          <v-img :src="image.image.url" :aspect-ratio="16 / 9"></v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"

interface ImageUrl {
  url: string
}

interface Image {
  id: number
  image: ImageUrl
  caption: string
}

interface Diary {
  id: number
  title: string
  content: string
  public: boolean
  date: string
  images: Image[]
}

@Component({
  async asyncData({ $axios, params }) {
    const DIARY_API = "/api/v1/diaries/" + `${params.id}`
    const diary = await $axios.$get(DIARY_API)
    return {
      diary: diary.data,
    }
  },
})
export default class DiaryDetail extends Vue {
  diary: Diary = {
    id: 0,
    title: "",
    content: "",
    public: false,
    date: "",
    images: [],
  }

  fmtDateWithoutTime(date: string) {
    return dateWithoutTimeFilter(date)
  }

  async fetchDiary() {
    const DIARY_API = "/api/v1/diaries/" + this.$route.params.id
    const diary = await this.$axios.$get(DIARY_API)
    this.diary = diary.data
  }
}
</script>

<style>
.text-body-2 {
  white-space: pre-wrap;
}
</style>
