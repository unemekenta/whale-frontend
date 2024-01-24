<template>
  <v-container fluid>
    <div v-for="(info, index) in informationContents" :key="index">
      <InformationBanner v-if="info.display_link" :txt="info.content" :link="info.link" />
      <InformationBanner v-else :txt="info.content" />
    </div>

    <v-row justify="justify-space-between">
      <v-col cols="12">
        <h1>みんなの投稿</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(diary, index) in diaries" :key="index" cols="12" sm="6" md="3">
        <DiaryCard :diary="diary" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { Diary, InformationContents } from "@/@types/common"
import DiaryCard from "@/components/common/DiaryCard.vue"

export default Vue.extend({
  components: {
    DiaryCard,
  },
  async asyncData({ $axios }) {
    const now = new Date().getTime()
    const TIMELINE_API = "/api/v1/diaries/timeline"
    const INFO_API = `/api/v1/information_contents?start_at=${now}&end_at=${now}`
    const diariesRes = await $axios.$get(TIMELINE_API)
    const informationContents = await $axios.$get(INFO_API)

    return {
      diaries: diariesRes.data.diaries,
      informationContents: informationContents.data.information_contents,
    }
  },
  data() {
    return {
      diaries: [] as Diary[],
      informationContents: [] as InformationContents[],
    }
  },
})
</script>
