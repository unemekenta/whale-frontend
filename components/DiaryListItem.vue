<template>
  <nuxt-link :to="'/diary/detail/' + diary.id" class="diary-item text-decoration-none">
    <ImageBasic
      v-if="diary.images.length > 0"
      :src="fmtImageUrl(diary.images[0].image.url)"
      :aspect-ratio="16 / 9"
      :alt="diary.images[0].caption"
      class="hide-below-pc"
    />
    <ImageBasic
      v-else
      :src="require('@/assets/images/common/reading-glasses.png')"
      :aspect-ratio="16 / 9"
      class="hide-below-pc"
    />
    <p class="contents">{{ diary.title }}</p>
    <p class="contents">{{ fmtDateWithoutTime }}</p>
    <p class="contents">{{ fmtIsPublic }}</p>
    <div class="contents">
      <v-btn icon @click.prevent="editDiary(diary.id)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click.prevent="deleteDiary(diary.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Diary } from "@/@types/common"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import ImageBasic from "@/components/common/ImageBasic.vue"
import { imageUrl } from "@/plugins/helpers/image"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    diary: {
      type: Object as PropType<Diary>,
      required: true,
    },
  },
  computed: {
    fmtDateWithoutTime() {
      return dateWithoutTimeFilter(this.diary.date)
    },
    fmtIsPublic() {
      if (this.diary.is_public) {
        return "公開"
      }
      return "未公開"
    },
  },
  methods: {
    editDiary(diaryId: number) {
      this.$emit("editDiary", diaryId)
    },
    deleteDiary(diaryId: number) {
      this.$emit("deleteDiary", diaryId)
    },
    fmtImageUrl(path: string) {
      return imageUrl(path)
    },
  },
})
</script>

<style lang="scss" scoped>
.diary-item {
  font-size: $font-middle;
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 1fr 1fr; /* 5つの要素を横並びに配置 */
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 2fr 1fr 2fr 1fr;
  }
  gap: 10px; /* グリッドアイテム間の隙間を設定（必要に応じて調整） */
  border-bottom: 1px solid #ccc;
  padding: 8px;
  .contents {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
</style>
