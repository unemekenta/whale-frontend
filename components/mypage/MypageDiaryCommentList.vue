<template>
  <div>
    <v-col v-if="comments.length === 0" cols="12">
      <p class="text-body-2">コメントはありません。</p>
    </v-col>
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="comment in comments" :key="comment.id" class="comment pa-0">
          <v-list-item-title>
            <p class="text-body-2">
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
          <v-list-item-action class="ml-3" @click="callEditComment(comment)">
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-action class="ml-3" @click="callDeleteComment(comment)">
            <v-icon>mdi-delete</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { dateFilter } from "@/plugins/filter/date-filter"
import { DiaryComment } from "@/@types/common"

export default Vue.extend({
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
      try {
        this.editComment(comment)
      } catch (error) {
        console.error(error)
      }
    },

    callDeleteComment(comment: DiaryComment) {
      try {
        this.deleteComment(comment)
      } catch (error) {
        console.error(error)
      }
    },

    fmtDate(date: string) {
      return dateFilter(date)
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
