<template>
  <v-container>
    <div v-for="(info, index) in informationContents" :key="index">
      <InformationBanner v-if="info.display_link" :txt="info.content" :link="info.link" />
      <InformationBanner v-else :txt="info.content" />
    </div>

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
              v-if="diary.images.length > 0"
              :src="diary.images[0].image.url"
              :aspect-ratio="16 / 9"
            ></v-img>
            <v-img
              v-else
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
import { Diary, InformationContents } from "@/@types/common"

@Component({
  async asyncData({ $axios }) {
    const now = new Date().getTime()
    const TIMELINE_API = "/api/v1/diaries/timeline"
    const INFO_API = "/api/v1/information_contents?start_at=" + now + "&end_at=" + now
    const diaries = await $axios.$get(TIMELINE_API)
    const informationContents = await $axios.$get(INFO_API)
    return {
      diaries: diaries.data,
      informationContents: informationContents.data,
    }
  },
})
export default class Index extends Vue {
  diaries: Diary[] = []
  informationContents: InformationContents[] = []

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
