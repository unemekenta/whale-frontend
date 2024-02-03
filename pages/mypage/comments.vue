<template>
  <v-container fluid>
    <div class="contents-main">
      <v-row justify="justify-space-between">
        <v-col cols="12">
          <h1 class="my-5">コメント一覧</h1>
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-row justify="end">
          <div v-if="displaySuccessModal" class="ma-3">
            <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
          </div>
          <div v-if="displayErrorModal" class="ma-3">
            <ErrorAlert :txt="errorModalTxt" />
          </div>
        </v-row>
      </v-col>
      <v-col cols="12">
        <MypageDiaryCommentList
          :comments="comments"
          :edit-comment="editComment"
          :delete-comment="deleteComment"
        />

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
      </v-col>
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { DiaryComment } from "@/@types/common"
import { dateFilter } from "@/plugins/filter/date-filter"
import MypageDiaryCommentList from "@/components/mypage/MypageDiaryCommentList.vue"

export default Vue.extend({
  components: {
    MypageDiaryCommentList,
  },
  middleware: "authenticated",
  async asyncData({ $axios }) {
    const COMMENTS_API = "/api/v1/diary_comments"
    const res = await $axios.$get(COMMENTS_API)
    return {
      comments: res.data.diary_comments,
    }
  },
  data() {
    return {
      showEditCommentForm: false,

      editCommentForm: {
        id: 0,
        content: "",
      },

      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "エラーが発生しました",

      comments: [] as DiaryComment[],
    }
  },

  methods: {
    async fetchComments() {
      const COMMENTS_API = "/api/v1/diary_comments"
      const res = await this.$axios.$get(COMMENTS_API)
      this.comments = res.data.diary_comments
    },
    async editComment(comment: DiaryComment) {
      const EDIT_COMMENT_API = "/api/v1/diary_comments/" + comment.id
      const res = await this.$axios.$get(EDIT_COMMENT_API)
      this.editCommentForm.id = comment.id
      this.editCommentForm.content = res.data.diary_comment.content

      this.showEditCommentForm = true
    },
    async deleteComment(comment: DiaryComment) {
      const DELETE_COMMENT_API = "/api/v1/diary_comments/" + comment.id
      await this.$axios.$delete(DELETE_COMMENT_API)
      try {
        this.successModalTxt = "コメントを削除しました。"
        this.displaySuccessModal = true
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
      } catch (error) {
        this.errorModalTxt = "削除に失敗しました。"
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      } finally {
        this.fetchComments()
      }
    },
    async updateComment() {
      const UPDATE_COMMENT_API = "/api/v1/diary_comments/" + this.editCommentForm.id
      await this.$axios.$put(UPDATE_COMMENT_API, this.editCommentForm)
      try {
        this.successModalTxt = "コメントを更新しました。"
        this.displaySuccessModal = true
        this.showEditCommentForm = false
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
      } catch (error) {
        this.errorModalTxt = "更新に失敗しました。"
        this.displayErrorModal = true
        this.showEditCommentForm = false
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      } finally {
        this.fetchComments()
      }
    },
    fmtDate(date: string) {
      return dateFilter(date)
    },
  },
})
</script>
