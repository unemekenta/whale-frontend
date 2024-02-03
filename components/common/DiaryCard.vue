<template>
  <nuxt-link :to="'/diary/detail/' + diary.id" class="text-decoration-none">
    <div class="card-contents">
      <div class="info-contents">
        <p class="title line-clamp-1">
          {{ diary.title }}
        </p>
        <p class="discription line-clamp-2">{{ diary.content }}</p>
        <div class="bottom-info">
          <div class="date">
            <p class="text-right ma-0 py-0">
              {{ fmtDateWithoutTime }}
            </p>
          </div>
          <div class="user-info">
            <v-avatar size="30" class="avatar">
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
          </div>
        </div>
      </div>
      <div class="image">
        <ImageBasic
          v-if="diary.images.length > 0"
          :src="fmtImageUrl"
          :aspect-ratio="16 / 9"
          :show-expansion="false"
        />
        <ImageBasic
          v-else
          :src="require('@/assets/images/common/reading-glasses.png')"
          :aspect-ratio="16 / 9"
          :show-expansion="false"
        />
      </div>
    </div>
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

<style lang="scss" scoped>
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

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.card-contents {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  padding: 8px;
  border-bottom: solid 1px $color-gray;

  .image {
    width: 100px;
    height: auto;
    border: solid 1px $color-gray;
    border-radius: $standard-radius;
  }

  .info-contents {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 4px;
    margin-right: 8px;

    .title {
      font-size: $font-normal;
      font-weight: bold;
    }
    .discription {
      font-size: $font-middle;
    }
    .bottom-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
      font-size: $font-small;
      .date {
        justify-self: start;
      }
      .user-info {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-self: end;
      }
    }
  }
}
</style>
