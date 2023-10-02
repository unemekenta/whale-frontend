<template>
  <v-container fluid>
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
      <v-col v-for="(diary, index) in diaries" :key="index" cols="12" sm="6" md="3">
        <nuxt-link :to="'/diary/detail/' + diary.id" class="text-decoration-none">
          <v-card>
            <ImageBasic
              v-if="diary.images.length > 0"
              :src="fmtImageUrl(diary.images[0].image.url)"
              :aspect-ratio="16 / 9"
            />
            <ImageBasic
              v-else
              :src="require('@/assets/images/common/reading-glasses.png')"
              :aspect-ratio="16 / 9"
            />
            <v-card-title class="my-1 py-1">
              <p class="line-clamp-1 my-0">
                {{ diary.title }}
              </p>
            </v-card-title>
            <v-row justify="justify-space-between" class="my-0 mx-2 align-center">
              <v-col cols="7" class="my-0 py-0">
                <v-row>
                  <v-avatar size="30" class="avatar">
                    <ImageBasic
                      v-if="diary.user.image"
                      :src="diary.user.image"
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
import Vue from "vue"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import { Diary, InformationContents } from "@/@types/common"
import { imageUrl } from "@/plugins/helpers/image"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
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
  methods: {
    fmtDateWithoutTime(date: string) {
      return dateWithoutTimeFilter(date)
    },

    fmtImageUrl(path: string) {
      return imageUrl(path)
    },
  },
})
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
