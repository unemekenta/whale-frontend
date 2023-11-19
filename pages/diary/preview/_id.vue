<template>
  <v-container fluid>
    <div class="contents-main">
      <v-row justify="justify-space-between">
        <v-alert dismissible elevation="10" variant="outlined" type="warning">
          プレビューモードで表示しています
        </v-alert>
        <v-col cols="12">
          <h1>{{ diary.title }}</h1>
        </v-col>
      </v-row>
      <v-divider justify="justify-space-between" class="my-3"></v-divider>
      <v-row class="align-center my-1 mx-0">
        <v-col cols="6" class="pa-0">
          <p class="ma-0">
            <small>{{ fmtDateWithoutTime(diary.date) }}</small>
          </p>
        </v-col>
        <v-col cols="6">
          <v-row mx-0 justify="end">
            <v-avatar size="40" class="avatar">
              <ImageBasic
                v-if="diary.user.image.url"
                :src="diary.user.image.url"
                :aspect-ratio="1"
                alt="avatarImage"
                class="avatar-image"
              />
              <ImageBasic
                v-else
                :src="require('@/assets/images/common/icon-user.png')"
                :aspect-ratio="1"
                alt="avatarImage"
                class="avatar-image"
              />
            </v-avatar>
            <p class="text-center my-auto nickname">
              <small>{{ diary.user.nickname }}</small>
            </p>
          </v-row>
        </v-col>
      </v-row>
      <p class="text-body-2">{{ diary.content }}</p>
      <v-row v-if="diary.images.length > 0">
        <v-col v-for="image in diary.images" :key="image.id" cols="12" md="4">
          <ImageBasic :src="image.image.url" :aspect-ratio="16 / 9" />
        </v-col>
      </v-row>
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  async asyncData({ $axios, params }) {
    const DIARY_API = "/api/v1/diaries/" + `${params.id}` + "/edit"
    const diaryRes = await $axios.$get(DIARY_API)
    return {
      diary: diaryRes.data.diary,
    }
  },
  methods: {
    fmtDateWithoutTime(date: string) {
      return dateWithoutTimeFilter(date)
    },
  },
})
</script>

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}
.text-body-2 {
  white-space: pre-wrap;
  line-height: 1.8em;
}

.nickname {
  display: inline;
  vertical-align: center;
}
</style>
