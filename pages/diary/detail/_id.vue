<template>
  <v-container fluid>
    <div class="contents-main">
      <v-row justify="justify-space-between">
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
            <nuxt-link :to="'/user/' + diary.user.id" class="user-link">
              <v-avatar size="40" class="avatar">
                <ImageBasic
                  v-if="diary.user.image.url"
                  :src="diary.user.image.url"
                  :aspect-ratio="1"
                  alt="avatarImage"
                  class="avatar-image"
                  :show-expansion="false"
                />
                <ImageBasic
                  v-else
                  :src="require('@/assets/images/common/icon-user.png')"
                  :aspect-ratio="1"
                  alt="avatarImage"
                  class="avatar-image"
                  :show-expansion="false"
                />
              </v-avatar>
              <p class="text-center my-auto nickname">
                <small>{{ diary.user.nickname }}</small>
              </p>
            </nuxt-link>
          </v-row>
        </v-col>
      </v-row>
      <p class="text-body-2">{{ diary.content }}</p>
      <v-row v-if="diary.images.length > 0">
        <v-col v-for="image in diary.images" :key="image.id" cols="12" md="4">
          <ImageBasic :src="image.image.url" :aspect-ratio="16 / 9" />
        </v-col>
      </v-row>
      <v-row class="mt-4 mb-2">
        <v-col cols="6">
          <h3>
            <v-icon>mdi-comment-multiple-outline</v-icon>コメント ({{
              diary.diary_comments.length
            }})
          </h3>
        </v-col>
        <v-col cols="6">
          <v-row justify="end">
            <v-btn class="ma-3" color="primary" @click="showCommentForm = true">コメント追加</v-btn>
          </v-row>
        </v-col>
      </v-row>
      <DiaryCommentList
        :comments="diary.diary_comments"
        :edit-comment="editComment"
        :delete-comment="deleteComment"
      />
      <v-dialog v-model="showCommentForm" max-width="500px">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>コメント追加</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showCommentForm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="submitComment">
              <v-textarea v-model="commentForm.content" label="コメント"></v-textarea>
              <v-btn type="submit" color="primary" class="mt-2">追加する</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showEditCommentForm" max-width="500px">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>コメント編集</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showEditCommentForm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="updateComment">
              <v-textarea v-model="editCommentForm.content" label="コメント"></v-textarea>
              <v-btn type="submit" color="primary" class="mt-2">保存する</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import { DiaryComment, Diary } from "@/@types/common"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  async asyncData({ $axios, params }) {
    const DIARY_API = "/api/v1/diaries/" + `${params.id}`
    const diaryRes = await $axios.$get(DIARY_API)
    return {
      diary: diaryRes.data.diary,
    }
  },
  data() {
    return {
      commentForm: {
        content: "",
        uid: "",
      },
      editCommentForm: {
        id: 0,
        content: "",
      },
      showCommentForm: false,
      showEditCommentForm: false,
      showEditDiaryForm: false,

      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "エラーが発生しました",
    }
  },
  methods: {
    fmtDateWithoutTime(date: string) {
      return dateWithoutTimeFilter(date)
    },

    async fetchDiary() {
      const DIARY_API = "/api/v1/diaries/" + this.$route.params.id
      const diaryRes = await this.$axios.$get(DIARY_API)
      this.diary = diaryRes.data.diary
    },

    async editComment(comment: DiaryComment) {
      const EDIT_COMMENT_API = "/api/v1/diaries/" + this.diary.id + "/diary_comments/" + comment.id
      const res = await this.$axios.$get(EDIT_COMMENT_API)
      this.editCommentForm.id = comment.id
      this.editCommentForm.content = res.data.diary_comment.content

      this.showEditCommentForm = true
    },

    async submitComment() {
      try {
        const uid = window.localStorage.getItem("uid")
        if (uid === null) {
          return
        }
        this.commentForm.uid = uid
        const POST_COMMENT_API = "/api/v1/diaries/" + this.diary.id + "/diary_comments"
        await this.$axios.$post(POST_COMMENT_API, this.commentForm)
        this.successModalTxt = "コメントを登録しました。"
        this.displaySuccessModal = true
        this.showCommentForm = false
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
        this.fetchDiary()
      } catch (error) {
        this.errorModalTxt = "登録に失敗しました。"
        this.displayErrorModal = true
        this.showCommentForm = false
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },

    async deleteComment(comment: DiaryComment) {
      const DELETE_COMMENT_API =
        "/api/v1/diaries/" + this.diary.id + "/diary_comments/" + comment.id
      await this.$axios.$delete(DELETE_COMMENT_API)
      try {
        this.successModalTxt = "コメントを削除しました。"
        this.displaySuccessModal = true
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
        this.fetchDiary()
      } catch (error) {
        this.errorModalTxt = "削除に失敗しました。"
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },

    async updateComment() {
      const UPDATE_COMMENT_API =
        "/api/v1/diaries/" + this.diary.id + "/diary_comments/" + this.editCommentForm.id
      await this.$axios.$put(UPDATE_COMMENT_API, this.editCommentForm)
      try {
        this.successModalTxt = "コメントを更新しました。"
        this.displaySuccessModal = true
        this.showEditCommentForm = false
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
        this.fetchDiary()
      } catch (error) {
        this.errorModalTxt = "更新に失敗しました。"
        this.displayErrorModal = true
        this.showEditCommentForm = false
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
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

.user-link {
  text-decoration: none;
}
.nickname {
  display: inline;
  vertical-align: center;
}
</style>
