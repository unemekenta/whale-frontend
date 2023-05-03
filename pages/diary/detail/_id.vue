<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>{{ diary.title }}</h1>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <small>{{ fmtDateWithoutTime(diary.date) }}</small>
    <h2 class="my-2">概要</h2>
    <p class="text-body-2" >{{ diary.content }}</p>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { dateWithoutTimeFilter } from '@/plugins/filter/date-filter'

interface Diary {
  id: number;
  title: string;
  content: string;
  public: boolean;
  date: string;
}

@Component({
async asyncData({$axios, params}) {
  const DIARY_API = "/api/v1/diaries/" + `${params.id}`
  const diary = await $axios.$get(DIARY_API)
  return {
    diary: diary.data
  }
}})

export default class DiaryDetail extends Vue {

  diary: Diary = {
    id: 0,
    title: '',
    content: '',
    public: false,
    date: '',
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