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
    <!-- 新規追加フォーム -->
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

            <v-chip
              v-for="(tag, index) in selectedTags"
              :key="index"
              @click="removeTag(tag)"
              class="ma-1"
              color="primary"
            >
              {{ tag.name }}
              <v-icon small>mdi-close</v-icon>
            </v-chip>

            <v-text-field
              v-model="inputName"
              label="タグ追加"
              @input="searchTag"
              class="mx-7 my-1"
            />
            <v-list v-if="inputName.length > 0 && suggestTags.length > 0" class="mx-7 my-0">
              <!-- <v-subheader>タグ候補</v-subheader> -->
              <v-list-item-group>
                <v-list-item
                  v-for="(tag, index) in suggestTags"
                  :key="index"
                  @click="addTag(tag)"
                >
                  <v-list-item-content class="pa-1">
                    <v-list-item-title class="subtitle-2">
                      {{ tag.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon small>mdi-plus</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-alert
              v-if="suggestTags.length === 0 && inputName.length > 0"
              :value="true"
              color="error"
              class="mt-1 mx-7 subtitle-2"
            >
              検索結果がありません
            </v-alert>
            <v-btn type="submit" color="primary" class="mt-2">追加する</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 編集フォーム -->
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

            <v-chip
              v-for="(tag, index) in editSelectedTags"
              :key="index"
              @click="removeEditTag(tag)"
              class="ma-1"
              color="primary"
            >
              {{ tag.name }}
              <v-icon small>mdi-close</v-icon>
            </v-chip>

            <v-text-field
              v-model="editInputName"
              label="タグ追加"
              @input="editSearchTag"
              class="mx-7 my-1"
            />
            <v-list v-if="editInputName.length > 0 && editSuggestTags.length > 0" class="mx-7 my-0">
              <!-- <v-subheader>タグ候補</v-subheader> -->
              <v-list-item-group>
                <v-list-item
                  v-for="(tag, index) in editSuggestTags"
                  :key="index"
                  @click="addEditTag(tag)"
                >
                  <v-list-item-content class="pa-1">
                    <v-list-item-title class="subtitle-2">
                      {{ tag.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon small>mdi-plus</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-alert
              v-if="editSuggestTags.length === 0 && inputName.length > 0"
              :value="true"
              color="error"
              class="mt-1 mx-7 subtitle-2"
            >
              検索結果がありません
            </v-alert>
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

interface Tag {
  id: number;
  name: string;
}

interface Tagging {
  tag_id: number;
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
  inputName = '';
  editInputName = '';
  suggestTags: Tag[] = [];
  selectedTags: Tag[] = [];
  taggingForm: Tagging[] = [];
  editSuggestTags: Tag[] = [];
  editSelectedTags: Tag[] = [];
  editTaggingForm: Tagging[] = [];

  taskForm = {
    title: '',
    description: '',
    uid: '',
    priority: '',
    status: '',
    deadline: '',
    taggings: this.taggingForm,
  };

  editTaskForm = {
    id: 0,
    title: '',
    description: '',
    priority: '',
    status: '',
    deadline: '',
    taggings: this.editTaggingForm,
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
    this.editTaskForm.taggings = [];
    this.editSelectedTags = [];
    this.editSelectedTags = res.data.tags.map(( t: Tag ) => {
      return {id: t.id, name: t.name}
    });

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
      };
      this.taskForm.uid = uid;
      const POST_TASK_API = "/api/v1/tasks";
      this.selectedTags.forEach ((tag) => {
        this.taskForm.taggings.push({"tag_id": tag.id});
      });
      const response = await this.$axios.$post(POST_TASK_API, this.taskForm);
      this.successModalTxt = response.data.title + 'を登録しました。';
      this.displaySuccessModal = true;
      this.showTaskForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false;
      }, 4000);
      this.fetchTasks();
    }
    catch(error) {
      this.errorModalTxt = '登録に失敗しました。';
      this.displayErrorModal = true;
      this.showTaskForm = false;
      setTimeout(() => {
        this.displayErrorModal = false;
      }, 4000);
    }
  }

  async updateTask() {
    const UPDATE_TASK_API = "/api/v1/tasks/" + this.editTaskForm.id;
    this.editTaskForm.taggings = [];
    this.editSelectedTags.forEach ((tag) => {
      this.editTaskForm.taggings.push({"tag_id": tag.id});
    });
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
        this.displayErrorModal = false;
      }, 4000);
    }
  }

  async searchTag() {
    const SEARCH_TAG_API = "/api/v1/tags/search?keyword=" + this.inputName;
    const response = await this.$axios.$get(SEARCH_TAG_API);
    this.suggestTags = response.data;
  }

  async editSearchTag() {
    const SEARCH_TAG_API = "/api/v1/tags/search?keyword=" + this.editInputName;
    const response = await this.$axios.$get(SEARCH_TAG_API);
    this.editSuggestTags = response.data;
  }

  removeTag(tag: Tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
    }
  }

  addTag(tag: Tag) {
    this.selectedTags.push(tag);
  }

  removeEditTag(tag: Tag) {
    const index = this.editSelectedTags.indexOf(tag);
    if (index !== -1) {
      this.editSelectedTags.splice(index, 1);
    }
  }

  addEditTag(tag: Tag) {
    this.editSelectedTags.push(tag);
  }
}

</script>