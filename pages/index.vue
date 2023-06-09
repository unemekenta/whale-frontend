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
            <v-img
              :src="require('@/assets/images/common/reading-glasses.png')"
              :aspect-ratio="16 / 9"
            ></v-img>
            <v-card-title class="my-1 py-1">
              <p class="line-clamp-1 my-0">
                {{ diary.title }}
              </p>
            </v-card-title>
            <v-row justify="justify-space-between" class="my-0 mx-2 align-center">
              <v-col cols="7" class="my-0 py-0">
                <v-row>
                  <v-avatar size="30" class="avatar">
                    <v-img
                      v-if="diary.user.image"
                      :src="diary.user.image"
                      :aspect-ratio="1"
                      alt="avatarImage"
                      class="avatar-image"
                    />
                    <v-img
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
              <v-col cols="5" class="my-0 py-0">
                <v-card-subtitle class="ma-0 pa-0">
                  <p class="text-right ma-0 py-0">
                    {{ fmtDateWithoutTime(diary.date) }}
                  </p>
                </v-card-subtitle>
              </v-col>
            </v-row>

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

interface User {
  id: number
  nickname: string
  image: string
}

interface Diary {
  id: number
  title: string
  content: string
  public: boolean
  date: string
  user: User
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
