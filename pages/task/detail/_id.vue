<template>
  <v-container fluid>
    <div class="contents-main">
      <v-row justify="justify-space-between">
        <v-col cols="12">
          <v-chip class="font-weight-bold chip" :color="getStatusColor(task.status)" dark>
            {{ fmtStatus(task.status) }}
          </v-chip>
          <h1>{{ task.title }}</h1>
        </v-col>
      </v-row>
      <v-divider class="my-3"></v-divider>
      <v-row justify="end">
        <div v-if="displaySuccessModal" class="ma-3">
          <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
        </div>
        <div v-if="displayErrorModal" class="ma-3">
          <ErrorAlert :txt="errorModalTxt" />
        </div>
        <!-- <v-btn class="ma-3" color="primary" @click="showEditTaskForm = true">編集</v-btn> -->
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-row no-gutters>
            <v-col v-for="tag in task.tags" :key="tag.id" cols="auto" dark>
              <Tag :txt="tag.name"></Tag>
            </v-col>
          </v-row>
          <h2 class="my-2">概要</h2>
          <div v-if="task.description">
            <p class="text-body-2">{{ task.description }}</p>
          </div>
          <div v-else>
            <p class="text-body-2">コンテンツがありません</p>
          </div>
          <v-row class="my-2">
            <v-col cols="6">
              <h3>
                <v-icon>mdi-comment-multiple-outline</v-icon>コメント ({{ task.comments.length }})
              </h3>
            </v-col>
            <v-col cols="6">
              <v-row justify="end">
                <v-btn class="ma-3" color="primary" @click="showCommentForm = true"
                  >コメント追加</v-btn
                >
              </v-row>
            </v-col>
          </v-row>

          <TaskCommentList
            :comments="task.comments"
            :edit-comment="editComment"
            :delete-comment="deleteComment"
          />
        </v-col>
      </v-row>
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
      <v-dialog v-model="showEditTaskForm" max-width="500px">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>タスク編集</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showEditTaskForm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-dialog>
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { statusFilter, statusColor } from "@/plugins/filter/label-filter"
import { dateFilter } from "@/plugins/filter/date-filter"
import { Task, TaskComment } from "@/@types/common"

@Component({
  async asyncData({ $axios, params }) {
    const TASK_API = "/api/v1/tasks/" + `${params.id}`
    const taskRes = await $axios.$get(TASK_API)
    return {
      task: taskRes.data.task,
    }
  },
})
export default class TaskDetail extends Vue {
  task: Task = {
    id: 0,
    title: "",
    status: 0,
    description: "",
    priority: 0,
    deadline: "",
    updated_at: "",
    comments: [],
    tags: [],
  }

  commentForm = {
    content: "",
    uid: "",
  }

  editCommentForm = {
    id: 0,
    content: "",
  }

  priorities = [
    { priorityName: "緊急", id: 1 },
    { priorityName: "高い", id: 2 },
    { priorityName: "通常", id: 3 },
    { priorityName: "低い", id: 4 },
  ]

  statuses = [
    { statusName: "これから", id: 1 },
    { statusName: "頑張り中", id: 2 },
    { statusName: "保留中", id: 3 },
    { statusName: "達成", id: 4 },
  ]

  showCommentForm = false
  showEditCommentForm = false
  showEditTaskForm = false

  displaySuccessModal = false
  successModalTxt = ""
  displayErrorModal = false
  errorModalTxt = ""

  getStatusColor(status: number): string {
    return statusColor(status)
  }

  fmtStatus(statusNum: number) {
    return statusFilter(statusNum)
  }

  fmtDate(date: string) {
    return dateFilter(date)
  }

  async fetchTask() {
    // // タスクをAPIから取得する
    const TASK_API = "/api/v1/tasks/" + this.$route.params.id
    const taskRes = await this.$axios.$get(TASK_API)
    this.task = taskRes.data.task
  }

  async editComment(comment: TaskComment) {
    const EDIT_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments/" + comment.id
    const res = await this.$axios.$get(EDIT_COMMENT_API)
    this.editCommentForm.id = comment.id
    this.editCommentForm.content = res.data.comment.content

    this.showEditCommentForm = true
  }

  async submitComment() {
    try {
      const uid = window.localStorage.getItem("uid")
      if (uid === null) {
        return
      }
      this.commentForm.uid = uid
      const POST_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments"
      await this.$axios.$post(POST_COMMENT_API, this.commentForm)
      this.successModalTxt = "コメントを登録しました。"
      this.displaySuccessModal = true
      this.showCommentForm = false
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000)
      this.fetchTask()
    } catch (error) {
      this.errorModalTxt = "登録に失敗しました。"
      this.displayErrorModal = true
      this.showCommentForm = false
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }

  async deleteComment(comment: TaskComment) {
    const DELETE_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments/" + comment.id
    await this.$axios.$delete(DELETE_COMMENT_API)
    try {
      this.successModalTxt = "コメントを削除しました。"
      this.displaySuccessModal = true
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000)
      this.fetchTask()
    } catch (error) {
      this.errorModalTxt = "削除に失敗しました。"
      this.displayErrorModal = true
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }

  async updateComment() {
    const UPDATE_COMMENT_API =
      "/api/v1/tasks/" + this.task.id + "/comments/" + this.editCommentForm.id
    await this.$axios.$put(UPDATE_COMMENT_API, this.editCommentForm)
    try {
      this.successModalTxt = "コメントを更新しました。"
      this.displaySuccessModal = true
      this.showEditCommentForm = false
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000)
      this.fetchTask()
    } catch (error) {
      this.errorModalTxt = "更新に失敗しました。"
      this.displayErrorModal = true
      this.showEditCommentForm = false
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }
}
</script>

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}

.chip {
  font-size: $font-middle;
  display: flex;
  justify-content: center;
  max-width: 70px;
}

.text-body-2 {
  white-space: pre-wrap;
}

.tag-nomal {
  background-color: #ebeced;
  border-radius: 0 2px 2px 0;
  color: #55606a;
  display: inline-block;
  font-size: $font-small;
  line-height: 1.4rem;
  margin: 3px 4px 3px 8px;
  padding: 0 6px 0 8px;
  position: relative;
  text-decoration: none;
}

.avatar {
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>
