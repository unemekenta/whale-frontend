<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>タスク一覧</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="primary" @click="showTaskForm = true">タスク追加</v-btn>
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
              @click="editTask(task)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ task.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-pencil</v-icon>
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
            <v-btn type="submit" color="primary" class="mt-2">追加する</v-btn>
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

@Component
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
  showTaskForm = false;

  created() {
    this.fetchTasks();
  }

  async fetchTasks() {
    // // タスク一覧をAPIから取得する
    const TASK_API = "/api/v1/tasks"
    const tasks = await this.$axios.$get(TASK_API)
    // const response = await fetch('/api/tasks');
    // const tasks = await response.json();
    this.tasks = tasks.data;
  }

  editTask(task: Task) {
    // タスク編集フォームを開く
  }

  async submitTask() {
    // タスクを追加する
    const POST_TASK_API = "/api/v1/tasks"
    
  }
}

</script>