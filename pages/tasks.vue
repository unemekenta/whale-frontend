<template>
  <v-container fluid>
    <div class="contents-main">
      <v-row justify="justify-space-between">
        <v-col cols="6">
          <h1>目標</h1>
        </v-col>
        <v-col cols="6" class="my-auto">
          <v-row justify="end">
            <v-btn class="ma-3" color="primary" @click="showTaskForm = true">タスク追加</v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="my-3"></v-divider>
      <div v-if="displaySuccessModal" class="ma-3">
        <SuccessAlert :txt="successModalTxt" transition="fade-transition" />
      </div>
      <div v-if="displayErrorModal" class="ma-3">
        <ErrorAlert :txt="errorModalTxt" />
      </div>
      <v-select
        v-model="statusFilterVal"
        :items="statusOptions"
        label="Status"
        @change="changeStatusFilter"
      ></v-select>
      <v-row class="mx-1">
        <v-col v-if="tasks.length === 0" cols="12">
          <p>現在、目標はありません。</p>
        </v-col>
        <v-col v-else cols="12" class="px-0">
          <TaskListHeader />
          <div v-for="(task, index) in tasks" :key="index">
            <TaskListItem :task="task" @editTask="editTask" @deleteTask="deleteTask" />
          </div>
        </v-col>
      </v-row>
      <PagiNationComponent :pages="pages" :current-page="currentPage" @changePage="changePage" />
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
                :items="statusOptions"
              ></v-select>
              <v-text-field v-model="taskForm.deadline" label="完了予定日" type="datetime-local" />

              <v-chip
                v-for="(tag, index) in selectedTags"
                :key="index"
                class="ma-1"
                color="primary"
                @click="removeTag(tag)"
              >
                {{ tag.name }}
                <v-icon small class="ml-2">mdi-close</v-icon>
              </v-chip>

              <v-text-field
                v-model="inputName"
                label="タグ追加"
                class="mx-7 my-1"
                @input="searchTag"
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
                :items="statusOptions"
              ></v-select>
              <v-text-field
                v-model="editTaskForm.deadline"
                label="完了予定日"
                type="datetime-local"
              />

              <v-chip
                v-for="(tag, index) in editSelectedTags"
                :key="index"
                class="ma-1"
                color="primary"
                @click="removeEditTag(tag)"
              >
                {{ tag.name }}
                <v-icon small class="ml-2">mdi-close</v-icon>
              </v-chip>

              <v-text-field
                v-model="editInputName"
                label="タグ追加"
                class="mx-7 my-1"
                @input="editSearchTag"
              />
              <v-list
                v-if="editInputName.length > 0 && editSuggestTags.length > 0"
                class="mx-7 my-0"
              >
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
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { Task, Tag, Tagging, PagiNation } from "@/@types/common"
import { TaskListTable } from "@/@types/task"
import { stringToISOString } from "@/plugins/date-format"
import { statusFilter, statusColor } from "@/plugins/filter/label-filter"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import PagiNationComponent from "@/components/common/PagiNation.vue"
import TaskListItem from "@/components/TaskListItem.vue"
import TaskListHeader from "@/components/TaskListHeader.vue"

export default Vue.extend({
  components: {
    TaskListItem,
    TaskListHeader,
    PagiNationComponent,
  },
  middleware: "authenticated",
  async asyncData({ $axios, route }) {
    const page = route.query.page || 1
    const status = route.query.status || "all"
    const TASK_API = `/api/v1/tasks?page=${page}&status=${status}`
    const tasksRes = await $axios.$get(TASK_API)

    return {
      tasks: tasksRes.data.tasks,
      tasksTableList: tasksRes.data.tasks.map(
        ({ id, title, status, priority, deadline }: TaskListTable) => ({
          id,
          title,
          status,
          priority,
          deadline: dateWithoutTimeFilter(deadline),
          actions: "",
        })
      ),
      pagination: tasksRes.data.pagination,
    }
  },
  data() {
    return {
      tasks: [] as Task[],
      tasksTableList: [] as TaskListTable[],
      pagination: {} as PagiNation,
      headers: [
        { text: "ステータス", value: "status" },
        { text: "タイトル", value: "title" },
        { text: "優先度", value: "priority" },
        { text: "完了予定", value: "deadline" },
        { text: "", value: "actions" },
      ],
      selectedTask: null as Task | null,
      inputName: "",
      editInputName: "",
      suggestTags: [] as Tag[],
      selectedTags: [] as Tag[],
      taggingForm: [] as Tagging[],
      editSuggestTags: [] as Tag[],
      editSelectedTags: [] as Tag[],
      editTaggingForm: [] as Tagging[],
      taskForm: {
        title: "",
        description: "",
        uid: "",
        priority: "",
        status: "",
        deadline: new Date().toLocaleDateString(),
        taggings: [] as Tagging[],
      },
      editTaskForm: {
        id: 0,
        title: "",
        description: "",
        priority: "",
        status: "",
        deadline: new Date().toLocaleDateString(),
        taggings: [] as Tagging[],
      },
      priorities: [
        { priorityName: "緊急", id: 1 },
        { priorityName: "高い", id: 2 },
        { priorityName: "通常", id: 3 },
        { priorityName: "低い", id: 4 },
      ],
      showTaskForm: false,
      showEditTaskForm: false,
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "",
      statusFilterVal: "all",
      statusOptions: [
        { text: "全て", value: "all" },
        { text: "これから", value: "not_started" },
        { text: "頑張り中", value: "in_progress" },
        { text: "保留中", value: "on_hold" },
        { text: "達成", value: "completed" },
      ],
    }
  },
  computed: {
    pages(): number[] {
      const pages: number[] = []
      for (let i = 1; i <= this.pagination.total_pages; i++) {
        pages.push(i)
      }
      return pages
    },
    currentPage(): number {
      const currentPage = this.pagination.current_page
      return currentPage
    },
  },
  methods: {
    fmtStatus(status: string) {
      return statusFilter(status)
    },

    getStatusColor(status: string): string {
      return statusColor(status)
    },

    async changeStatusFilter() {
      // // URLのクエリパラメータも変更
      const query = Object.assign({}, this.$route.query)
      query.status = this.statusFilterVal
      await this.$router.push({ query })
      this.fetchTasks()
    },

    async changePage(pageInt: number) {
      this.pagination.current_page = pageInt
      // URLのクエリパラメータも変更
      const query = Object.assign({}, this.$route.query)
      query.page = pageInt.toString()
      await this.$router.push({ query })
      this.fetchTasks()
    },

    async fetchTasks() {
      // // タスク一覧をAPIから取得する
      const TASK_API = `/api/v1/tasks?page=${this.currentPage}&status=${this.statusFilterVal}`
      const tasksRes = await this.$axios.$get(TASK_API)
      this.tasks = tasksRes.data.tasks
      this.tasksTableList = tasksRes.data.tasks.map(
        ({ id, title, status, priority, deadline }: TaskListTable) => ({
          id,
          title,
          status,
          priority,
          deadline: dateWithoutTimeFilter(deadline),
          actions: "",
        })
      )
      this.pagination = Object.assign({}, tasksRes.data.pagination)
    },

    async editTask(taskId: number) {
      const EDIT_TASK_API = "/api/v1/tasks/" + taskId
      const res = await this.$axios.$get(EDIT_TASK_API)
      this.editTaskForm.id = taskId
      this.editTaskForm.title = res.data.task.title
      this.editTaskForm.description = res.data.task.description
      this.editTaskForm.priority = res.data.task.priority
      this.editTaskForm.status = res.data.task.status
      this.editTaskForm.deadline = stringToISOString(res.data.task.deadline)
      this.editTaskForm.taggings = []
      this.editSelectedTags = []
      this.editSelectedTags = res.data.task.tags.map((t: Tag) => {
        return { id: t.id, name: t.name }
      })

      this.showEditTaskForm = true
    },

    async deleteTask(taskId: number) {
      const DELETE_TASK_API = "/api/v1/tasks/" + taskId
      const response = await this.$axios.$delete(DELETE_TASK_API)
      try {
        this.successModalTxt = response.data.title + "を削除しました。"
        this.displaySuccessModal = true
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
        this.fetchTasks()
      } catch (error) {
        this.errorModalTxt = "削除に失敗しました。"
        this.displayErrorModal = true
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },

    async submitTask() {
      try {
        const uid = window.localStorage.getItem("uid")
        if (uid === null) {
          return
        }
        this.taskForm.uid = uid
        const POST_TASK_API = "/api/v1/tasks"
        this.selectedTags.forEach((tag) => {
          this.taskForm.taggings.push({ tag_id: tag.id })
        })
        const response = await this.$axios.$post(POST_TASK_API, this.taskForm)
        this.successModalTxt = response.data.title + "を登録しました。"
        this.displaySuccessModal = true
        this.showTaskForm = false
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
        this.fetchTasks()
      } catch (error) {
        this.errorModalTxt = "登録に失敗しました。"
        this.displayErrorModal = true
        this.showTaskForm = false
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },

    async updateTask() {
      const UPDATE_TASK_API = "/api/v1/tasks/" + this.editTaskForm.id
      this.editTaskForm.taggings = []
      this.editSelectedTags.forEach((tag) => {
        this.editTaskForm.taggings.push({ tag_id: tag.id })
      })
      const response = await this.$axios.$put(UPDATE_TASK_API, this.editTaskForm)
      try {
        this.successModalTxt = response.data.title + "を更新しました。"
        this.displaySuccessModal = true
        this.showEditTaskForm = false
        setTimeout(() => {
          this.displaySuccessModal = false
        }, 4000)
        this.fetchTasks()
      } catch (error) {
        this.errorModalTxt = "更新に失敗しました。"
        this.displayErrorModal = true
        this.showEditTaskForm = false
        setTimeout(() => {
          this.displayErrorModal = false
        }, 4000)
      }
    },

    async searchTag() {
      const SEARCH_TAG_API = "/api/v1/tags/search?keyword=" + this.inputName
      const response = await this.$axios.$get(SEARCH_TAG_API)
      this.suggestTags = response.data
    },

    async editSearchTag() {
      const SEARCH_TAG_API = "/api/v1/tags/search?keyword=" + this.editInputName
      const response = await this.$axios.$get(SEARCH_TAG_API)
      this.editSuggestTags = response.data.tags
    },

    removeTag(tag: Tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index !== -1) {
        this.selectedTags.splice(index, 1)
      }
    },

    addTag(tag: Tag) {
      this.selectedTags.push(tag)
    },

    removeEditTag(tag: Tag) {
      const index = this.editSelectedTags.indexOf(tag)
      if (index !== -1) {
        this.editSelectedTags.splice(index, 1)
      }
    },

    addEditTag(tag: Tag) {
      this.editSelectedTags.push(tag)
    },
  },
})
</script>

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}
</style>
