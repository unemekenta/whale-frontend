<template>
  <nuxt-link :to="'/diary/detail/' + diary.id" class="text-decoration-none">
    <v-card>
      <ImageBasic v-if="diary.images.length > 0" :src="fmtImageUrl" :aspect-ratio="16 / 9" />
      <ImageBasic
        v-else
        :src="require('@/assets/images/common/reading-glasses.png')"
        :aspect-ratio="16 / 9"
      />
      <v-card-title class="my-1 py-1 title">
        <p class="line-clamp-1 my-0">
          {{ diary.title }}
        </p>
      </v-card-title>
      <div class="card-info">
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
      </div>
      <v-card-text
        ><p class="line-clamp-2">{{ diary.content }}</p></v-card-text
      >
      <div class="date">
        <v-card-subtitle class="ma-0 pa-0">
          <p class="text-right ma-0 py-0">
            {{ fmtDateWithoutTime }}
          </p>
        </v-card-subtitle>
      </div>
    </v-card>
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import ImageBasic from "@/components/common/ImageBasic.vue"
import { Diary } from "@/@types/common"
import { imageUrl } from "@/plugins/helpers/image"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    diary: {
      type: Object as PropType<Diary>,
      default: null,
      required: true,
    },
  },
  computed: {
    fmtDateWithoutTime() {
      return dateWithoutTimeFilter(this.diary.date)
    },

    fmtImageUrl() {
      return imageUrl(this.diary.images[0]?.image.url)
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

.title {
  display: inline-block;
}

.card-info {
  display: flex;
  padding: 0 16px;
  justify-content: left;
}

.date {
  display: flex;
  justify-content: right;
  padding: 0 16px 16px;
}
</style>
