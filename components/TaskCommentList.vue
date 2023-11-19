<template>
  <div>
    <v-col v-if="comments.length === 0" cols="12">
      <p>コメントはありません。</p>
    </v-col>
    <v-list class="px-0">
      <v-list-item-group>
        <v-list-item v-for="comment in comments" :key="comment.id" class="comment pa-0">
          <v-list-item-content>
            <v-row no-gutters>
              <v-col cols="2" md="1">
                <v-avatar size="40" class="avatar">
                  <ImageBasic
                    v-if="comment.user.image.url"
                    :src="comment.user.image.url"
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
                <p v-if="comment.user.nickname" class="text-center comment-nickname">
                  {{ comment.user.nickname }}
                </p>
                <p v-else class="text-center comment-nickname">匿名ユーザー</p>
              </v-col>
              <v-col cols="10" md="11" class="px-2 py-2 comment-text">
                <v-list-item-title>
                  <p>
                    {{ comment.content }}
                  </p>
                </v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  <div>
                    <p class="comment-date">
                      {{ fmtDate(comment.updated_at) }}
                    </p>
                  </div>
                </v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item-content>
          <v-list-item-action
            v-if="$auth.user.data?.id === comment.user.id"
            class="ml-3"
            @click="callEditComment(comment)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-action v-else></v-list-item-action>
          <v-list-item-action
            v-if="$auth.user.data?.id === comment.user.id"
            class="ml-3"
            @click="callDeleteComment(comment)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-list-item-action>
          <v-list-item-action v-else></v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { dateFilter } from "@/plugins/filter/date-filter"
import { DiaryComment } from "@/@types/common"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    comments: {
      type: Array as PropType<DiaryComment[]>,
      required: true,
    },
    editComment: {
      type: Function,
      required: true,
    },
    deleteComment: {
      type: Function,
      required: true,
    },
  },
  methods: {
    callEditComment(comment: DiaryComment) {
      const uid = window.localStorage.getItem("uid")
      if (uid === null) {
        return
      }

      try {
        this.editComment(comment)
      } catch (error) {
        console.error(error)
      }
    },

    fmtDate(date: string) {
      return dateFilter(date)
    },

    callDeleteComment(comment: DiaryComment) {
      // フォームの入力内容を親コンポーネントに送信する
      const uid = window.localStorage.getItem("uid")
      if (uid === null) {
        return
      }

      try {
        this.deleteComment(comment)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.comment-text p {
  font-size: $font-middle;
  line-height: 1.8em;
  @media screen and (max-width: $breakpoint-md) {
    font-size: $font-small;
  }
  margin-bottom: 0.2rem;
  white-space: normal;
}

.comment-nickname {
  font-size: $font-small;
  @media screen and (max-width: $breakpoint-md) {
    font-size: $font-micro;
  }
  margin: 0;
}

.comment-date {
  font-size: $font-small;
  margin-bottom: 0.2rem;
  white-space: normal;
}

.avatar {
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>
