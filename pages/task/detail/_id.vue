<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>{{ task.title }}</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-row justify="end">
          <div class="ma-3" v-if="displaySuccessModal">
            <SuccessAlert :txt="successModalTxt" transition="fade-transition"/>
          </div>
          <div class="ma-3" v-if="displayErrorModal">
            <ErrorAlert :txt="errorModalTxt"/>
          </div>
          <!-- <v-btn class="ma-3" color="primary" @click="showEditTaskForm = true">編集</v-btn> -->
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row>
      <v-col cols="12">
        <v-chip class="ma-1" :color="getStatusColor(task.status)" dark>
          {{ task.status | toStatus }}
        </v-chip>
        <v-row no-gutters>
          <v-col
            v-for="tag in task.tags"
            :key="tag.id"
            cols="auto"
            dark
          >
            <v-chip class="ma-1">
              {{ tag.name }}
            </v-chip>
          </v-col>
        </v-row>
        <h2 class="my-2">概要</h2>
        <p class="text-body-2">{{ task.description }}</p>
        <v-row class="my-2">
          <v-col cols="12" md="6">
            <h2>コメント ({{ task.comments.length }})</h2>
          </v-col>
          <v-col cols="12" md="6">
            <v-row justify="end">
              <v-btn class="ma-3" color="primary" @click="showCommentForm = true">コメント追加</v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-col cols="12" v-if="task.comments.length === 0">
          <p>コメントはありません。</p>
        </v-col>
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="comment in task.comments"
              :key="comment.id"
              class="comment"
            >
              <v-list-item-content>
                <v-row no-gutters>
                  <v-col cols="1">
                    <v-row no-gutters>
                      <v-col>
                        <v-list-item-avatar class="ma-0" tile>
                          <v-icon>mdi-account</v-icon>
                        </v-list-item-avatar>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col>
                        <small class="text-center">{{ comment.user.nickname }}</small>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="11">
                    <v-list-item-title>{{ comment.content }}</v-list-item-title>
                    <v-list-item-subtitle class="mr-3 text-right">
                      <div>
                        <small>{{ comment.updated_at | toDate }}</small>
                      </div>
                    </v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item-content>
              <v-list-item-action @click="editComment(comment)">
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-action>
              <v-list-item-action @click="deleteComment(comment)">
                <v-icon>mdi-delete</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
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
        <!-- <v-card-text>
          <v-form @submit.prevent="updateTask">
            <v-text-field v-model="editTaskForm.title" label="タイトル"></v-text-field>
            <v-textarea v-model="editTaskForm.description" label="詳細"></v-textarea>
            <v-select
              v-model="editTaskForm.priority"
              label="優先度"
              :items="priorities"
              item-text="priorityName"
              item-value="id"
            ></v-select>
            <v-select
              v-model="editTaskForm.status"
              label="ステータス"
              :items="statuses"
              item-text="statusName"
              item-value="id"
            ></v-select>
            <v-text-field
              v-model="editTaskForm.deadline"
              label="完了予定日"
              type="datetime-local"
            />
            <v-btn type="submit" color="primary" class="mt-2">保存する</v-btn>
          </v-form>
        </v-card-text> -->
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

interface Task {
  id: number;
  title: string;
  status: number;
  description: string;
  comments: Comment[];
  tags: Tag[];
}

interface Comment {
  id: number;
  content: string;
  updated_at: string;
  user: User;
}

interface User {
  id: number;
  image: string;
  nickname: string;
}

interface Tag {
  id: number;
  name: string;
  created_at: string;
}

@Component
export default class TaskDetail extends Vue {

  task: Task = {
    id: 0,
    title: '',
    status: 0,
    description: '',
    comments: [],
    tags: [],
  };

  selectedTask: Task | null = null;

  commentForm = {
    content: '',
    uid: '',
  };

  editCommentForm = {
    id: 0,
    content: '',
  };

  // editTaskForm = {
  //   id: 0,
  //   title: '',
  //   description: '',
  //   priority: '',
  //   status: '',
  //   deadline: ''
  // };

  priorities = [
    { priorityName: "緊急", id: 1 },
    { priorityName: "高い", id: 2 },
    { priorityName: "通常", id: 3 },
    { priorityName: "低い", id: 4 }
  ];

  statuses = [
    { statusName: "未実施", id: 1 },
    { statusName: "進行中", id: 2 },
    { statusName: "確認待ち", id: 3 },
    { statusName: "完了", id: 4 }
  ];

  showCommentForm = false;
  showEditCommentForm = false;
  showEditTaskForm = false;

  displaySuccessModal = false;
  successModalTxt = '';
  displayErrorModal = false;
  errorModalTxt = '';

  created() {
    this.fetchTask();
  }

  getStatusColor(status: number): string {
    console.log(status)
    switch (status) {
      case 1:
        return "grey";
      case 2:
        return "orange";
      case 3:
        return "blue";
      case 4:
        return "green";
      default:
        return "grey";
    }
  }

  async fetchTask() {
    // // タスクをAPIから取得する
    const TASK_API = "/api/v1/tasks/" + this.$route.params.id
    const task = await this.$axios.$get(TASK_API)
    // const response = await fetch('/api/tasks');
    // const tasks = await response.json();
    this.task = task.data;
  }

  async editComment(comment: Comment) {
    const EDIT_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments/" + comment.id;
    const res = await this.$axios.$get(EDIT_COMMENT_API);
    this.editCommentForm.id = comment.id;
    this.editCommentForm.content = res.data.content;

    this.showEditCommentForm = true;
  }

  async submitComment() {
    try {
      const uid = window.localStorage.getItem("uid");
      if (uid === null) {
        return
      }
      this.commentForm.uid = uid;
      const POST_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments"
      const response = await this.$axios.$post(POST_COMMENT_API, this.commentForm)
      this.successModalTxt = 'コメントを登録しました。';
      this.displaySuccessModal = true;
      this.showCommentForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchTask()
    }
    catch(error) {
      this.errorModalTxt = '登録に失敗しました。';
      this.displayErrorModal = true;
      this.showCommentForm = false;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }

  async deleteComment(comment: Comment) {
    const DELETE_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments/" + comment.id;
    const response = await this.$axios.$delete(DELETE_COMMENT_API);
    try {
      this.successModalTxt = 'コメントを削除しました。';
      this.displaySuccessModal = true;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchTask()
    }
    catch(error) {
      this.errorModalTxt = '削除に失敗しました。';
      this.displayErrorModal = true;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }

  async updateComment(comment: Comment) {
    const UPDATE_COMMENT_API = "/api/v1/tasks/" + this.task.id + "/comments/" + this.editCommentForm.id;
    const response = await this.$axios.$put(UPDATE_COMMENT_API, this.editCommentForm);
    try {
      this.successModalTxt = 'コメントを更新しました。';
      this.displaySuccessModal = true;
      this.showEditCommentForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchTask()
    }
    catch(error) {
      this.errorModalTxt = '更新に失敗しました。';
      this.displayErrorModal = true;
      this.showEditCommentForm = false;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }

  // async editTask(task: Task) {
  //   const EDIT_TASK_API = "/api/v1/tasks/" + task.id;
  //   const res = await this.$axios.$get(EDIT_TASK_API);
  //   this.editTaskForm.id = task.id;
  //   this.editTaskForm.title = res.data.title;
  //   this.editTaskForm.description = res.data.description;
  //   this.editTaskForm.priority = res.data.priority;
  //   this.editTaskForm.status = res.data.status;
  //   this.editTaskForm.deadline = res.data.deadline;

  //   this.showEditTaskForm = true;
  // }

  // async deleteTask(task: Task) {
  //   const DELETE_TASK_API = "/api/v1/tasks/" + task.id;
  //   const response = await this.$axios.$delete(DELETE_TASK_API);
  //   try {
  //     this.successModalTxt = response.data.title + 'を削除しました。';
  //     this.displaySuccessModal = true;
  //     setTimeout(() => {
  //       this.displaySuccessModal = false
  //     }, 4000);
  //     this.fetchTasks()
  //   }
  //   catch(error) {
  //     this.errorModalTxt = '削除に失敗しました。';
  //     this.displayErrorModal = true;
  //     setTimeout(() => {
  //       this.displayErrorModal = false
  //     }, 4000);
  //   }
  // }

  // async updateTask() {
  //   const UPDATE_TASK_API = "/api/v1/tasks/" + this.editTaskForm.id;
  //   const response = await this.$axios.$put(UPDATE_TASK_API, this.editTaskForm);
  //   try {
  //     this.successModalTxt = response.data.title + 'を更新しました。';
  //     this.displaySuccessModal = true;
  //     this.showEditTaskForm = false;
  //     setTimeout(() => {
  //       this.displaySuccessModal = false
  //     }, 4000);
  //     this.fetchTasks()
  //   }
  //   catch(error) {
  //     this.errorModalTxt = '更新に失敗しました。';
  //     this.displayErrorModal = true;
  //     this.showEditTaskForm = false;
  //     setTimeout(() => {
  //       this.displayErrorModal = false
  //     }, 4000);
  //   }
  // }
}

</script>

<style>
.comment {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.comment .v-list-item-content {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.comment .v-list-item-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.comment .v-list-item-subtitle {
  font-size: 0.9rem;
}
</style>