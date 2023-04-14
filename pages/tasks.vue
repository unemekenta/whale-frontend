<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>タスク一覧</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-row justify="end">
          <div class="ma-3" v-if="displaySuccessModal">
            <SuccessAlert :txt="successModalTxt" transition="fade-transition"/>
          </div>
          <div class="ma-3" v-if="displayErrorModal">
            <ErrorAlert :txt="errorModalTxt"/>
          </div>
          <v-btn class="ma-3" color="primary" @click="showTaskForm = true">タスク追加</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row>
      <v-col cols="12" v-if="tasks.length === 0">
        <p>現在、タスクはありません。</p>
      </v-col>
      <v-col cols="12" v-else>
        <v-list>
          <v-list-item-group v-model="selectedTask">
            <v-list-item
              v-for="task in tasks"
              :key="task.id"
            >
              <v-list-item-content>
                <nuxt-link :to="'/task/detail/' + task.id" class="text-decoration-none">
                  <v-list-item-title>{{ task.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
                </nuxt-link>
              </v-list-item-content>
              <v-list-item-action @click="editTask(task)">
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-action>
              <v-list-item-action @click="deleteTask(task)">
                <v-icon>mdi-delete</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-dialog v-model="showTaskForm" max-width="500px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>タスク追加</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showTaskForm = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="submitTask">
            <v-text-field v-model="taskForm.title" label="タイトル"></v-text-field>
            <v-textarea v-model="taskForm.description" label="詳細"></v-textarea>
            <v-select
              v-model="taskForm.priority"
              label="優先度"
              :items="priorities"
              item-text="priorityName"
              item-value="id"
            ></v-select>
            <v-select
              v-model="taskForm.status"
              label="ステータス"
              :items="statuses"
              item-text="statusName"
              item-value="id"
            ></v-select>
            <v-text-field
              v-model="taskForm.deadline"
              label="完了予定日"
              type="datetime-local"
            />
            <v-btn type="submit" color="primary" class="mt-2">追加する</v-btn>
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
        <v-card-text>
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
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

interface Task {
  id: number;
  title: string;
  description: string;
}

@Component({
async asyncData({$axios}) {
  const TASK_API = "/api/v1/tasks"
  const tasks = await $axios.$get(TASK_API)
  return {
    tasks: tasks.data
  }
}})

export default class TaskList extends Vue {

  tasks: Task[] = [];

  selectedTask: Task | null = null;

  taskForm = {
    title: '',
    description: '',
    uid: '',
    priority: '',
    status: '',
    deadline: ''
  };

  editTaskForm = {
    id: 0,
    title: '',
    description: '',
    priority: '',
    status: '',
    deadline: ''
  };

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

  showTaskForm = false;
  showEditTaskForm = false;

  displaySuccessModal = false;
  successModalTxt = '';
  displayErrorModal = false;
  errorModalTxt = '';


  async fetchTasks() {
    // // タスク一覧をAPIから取得する
    const TASK_API = "/api/v1/tasks"
    const tasks = await this.$axios.$get(TASK_API)
    this.tasks = tasks.data;
  }

  async editTask(task: Task) {
    const EDIT_TASK_API = "/api/v1/tasks/" + task.id;
    const res = await this.$axios.$get(EDIT_TASK_API);
    this.editTaskForm.id = task.id;
    this.editTaskForm.title = res.data.title;
    this.editTaskForm.description = res.data.description;
    this.editTaskForm.priority = res.data.priority;
    this.editTaskForm.status = res.data.status;
    this.editTaskForm.deadline = res.data.deadline;

    this.showEditTaskForm = true;
  }

  async deleteTask(task: Task) {
    const DELETE_TASK_API = "/api/v1/tasks/" + task.id;
    const response = await this.$axios.$delete(DELETE_TASK_API);
    try {
      this.successModalTxt = response.data.title + 'を削除しました。';
      this.displaySuccessModal = true;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchTasks()
    }
    catch(error) {
      this.errorModalTxt = '削除に失敗しました。';
      this.displayErrorModal = true;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }

  async submitTask() {
    try {
      const uid = window.localStorage.getItem("uid");
      if (uid === null) {
        return
      }
      this.taskForm.uid = uid;
      const POST_TASK_API = "/api/v1/tasks"
      const response = await this.$axios.$post(POST_TASK_API, this.taskForm)
      this.successModalTxt = response.data.title + 'を登録しました。';
      this.displaySuccessModal = true;
      this.showTaskForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchTasks()
    }
    catch(error) {
      this.errorModalTxt = '登録に失敗しました。';
      this.displayErrorModal = true;
      this.showTaskForm = false;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }

  async updateTask() {
    const UPDATE_TASK_API = "/api/v1/tasks/" + this.editTaskForm.id;
    const response = await this.$axios.$put(UPDATE_TASK_API, this.editTaskForm);
    try {
      this.successModalTxt = response.data.title + 'を更新しました。';
      this.displaySuccessModal = true;
      this.showEditTaskForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchTasks()
    }
    catch(error) {
      this.errorModalTxt = '更新に失敗しました。';
      this.displayErrorModal = true;
      this.showEditTaskForm = false;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }
}

</script>