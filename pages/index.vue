<template>
  <v-container fluid>
    <div class="contents-main">
      <div v-for="(info, index) in informationContents" :key="index">
        <InformationBanner v-if="info.display_link" :txt="info.content" :link="info.link" />
        <InformationBanner v-else :txt="info.content" />
      </div>

      <h1>みんなの投稿</h1>
      <div class="post-contents">
        <div v-for="(diary, index) in diaries" :key="index">
          <DiaryCard :diary="diary" />
        </div>
      </div>
    </div>
    <div class="side-contents"></div>
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

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}

.post-contents {
  margin-top: 24px;
}
</style>
