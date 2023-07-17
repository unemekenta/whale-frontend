<template>
  <div>
    <v-col v-if="comments.length === 0" cols="12">
      <p>コメントはありません。</p>
    </v-col>
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="comment in comments" :key="comment.id" class="comment py-0">
          <v-list-item-content>
            <v-row no-gutters>
              <v-col cols="1">
                <v-avatar size="40" class="avatar">
                  <v-img
                    v-if="comment.user.image"
                    :src="comment.user.image"
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
                <p class="text-center comment-nickname">
                  <small>{{ comment.user.nickname }}</small>
                </p>
              </v-col>
              <v-col cols="11" class="px-2 py-2 comment-text">
                <v-list-item-title>
                  <p>
                    {{ comment.content }}
                  </p>
                </v-list-item-title>
                <v-list-item-subtitle class="mr-3 text-right">
                  <div>
                    <p>
                      <small>{{ fmtDate(comment.updated_at) }}</small>
                    </p>
                  </div>
                </v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item-content>
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
import { Component, Prop, Vue } from "nuxt-property-decorator"
import { dateFilter } from "@/plugins/filter/date-filter"

interface User {
  id: number
  image: string
  nickname: string
}

interface Comment {
  id: number
  user_id: number
  diary_id: number
  content: string
  updated_at: string
  user: User
}

@Component
export default class CommentList extends Vue {
  @Prop({ type: Array, required: true })
  comments: Comment[]

  @Prop({ type: Function, required: true })
  editComment: Function

  @Prop({ type: Function, required: true })
  deleteComment: Function

  callEditComment(comment: Comment) {
    const uid = window.localStorage.getItem("uid")
    if (uid === null) {
      return
    }

    try {
      this.editComment(comment)
    } catch (error) {
      console.error(error)
    }
  }

  fmtDate(date: string) {
    return dateFilter(date)
  }

  callDeleteComment(comment: Comment) {
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
  }
}
</script>

<style scoped>
.comment-text p {
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
}

.comment-nickname {
  font-size: 0.6rem;
  margin: 0;
}

.avatar {
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>
