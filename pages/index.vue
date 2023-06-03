<template>
  <v-container>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>みんなの投稿</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(diary, index) in diaries" :key="index" cols="12" sm="6" md="4">
        <nuxt-link :to="'/diary/detail/' + diary.id" class="text-decoration-none">
          <v-card>
            <v-img src="/vuetify-logo.svg" :aspect-ratio="16 / 9"></v-img>
            <v-card-title
              ><p class="line-clamp-1">{{ diary.title }}</p></v-card-title
            >
            <v-card-subtitle>{{ fmtDateWithoutTime(diary.date) }}</v-card-subtitle>
            <v-card-text
              ><p class="line-clamp-2">{{ diary.content }}</p></v-card-text
            >
          </v-card>
        </nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"

interface Diary {
  id: number
  title: string
  content: string
  public: boolean
  date: string
}

@Component({
  async asyncData({ $axios }) {
    const TIMELINE_API = "/api/v1/diaries/timeline"
    const diaries = await $axios.$get(TIMELINE_API)
    return {
      diaries: diaries.data,
    }
  },
})
export default class Index extends Vue {
  diaries: Diary[] = []

  fmtDateWithoutTime(date: string) {
    return dateWithoutTimeFilter(date)
  }
}
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
