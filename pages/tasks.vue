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
      <div class="filter-list">
        <v-select
          v-model="statusFilterVal"
          :items="statusOptions"
          label="ステータス"
          class="px-1"
          @change="changeStatusFilter"
        ></v-select>
        <v-select
          v-model="priorityFilterVal"
          :items="priorityOptions"
          label="優先度"
          class="px-1"
          @change="changePriorityFilter"
        ></v-select>
      </div>
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
      <TaskFormDialog
        :show-task-form="showTaskForm"
        :dialog-title="'新規追加'"
        :task-form="taskForm"
        :selected-tags="selectedTags"
        @submitDiaryForm="submitTask"
        @close="showTaskForm = false"
      />

      <!-- 編集フォーム -->
      <TaskFormDialog
        :show-task-form="showEditTaskForm"
        :dialog-title="'編集'"
        :task-form="editTaskForm"
        :selected-tags="editSelectedTags"
        @submitDiaryForm="updateTask"
        @close="showEditTaskForm = false"
      />
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { Task, Tag, Tagging, PagiNation } from "@/@types/common"
import { TaskListTable, TaskForm } from "@/@types/task"
import { stringToISOString } from "@/plugins/date-format"
import {
  statusOptions,
  priorityOptions,
  statusSubmitOptions,
  prioritySubmitOptions,
} from "@/plugins/options"
import { statusFilter, statusColor } from "@/plugins/filter/label-filter"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import PagiNationComponent from "@/components/common/PagiNation.vue"
import TaskListItem from "@/components/TaskListItem.vue"
import TaskListHeader from "@/components/TaskListHeader.vue"
import TaskFormDialog from "~/components/TaskFormDialog.vue"

export default Vue.extend({
  components: {
    TaskListItem,
    TaskListHeader,
    PagiNationComponent,
    TaskFormDialog,
  },
  middleware: "authenticated",
  async asyncData({ $axios, route }) {
    const page = route.query.page || 1
    const status = route.query.status || "all"
    const priority = route.query.priority || "all"
    const TASK_API = `/api/v1/tasks?page=${page}&status=${status}&priority=${priority}`
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
      statusFilterVal: status,
      priorityFilterVal: priority,
    }
  },
  data() {
    return {
      tasks: [] as Task[],
      tasksTableList: [] as TaskListTable[],
      pagination: {} as PagiNation,
      selectedTags: [] as Tag[],
      editSelectedTags: [] as Tag[],
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
      showTaskForm: false,
      showEditTaskForm: false,
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "",
      statusFilterVal: "all",
      statusOptions,
      priorityOptions,
      statusSubmitOptions,
      prioritySubmitOptions,
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

    async changePriorityFilter() {
      // // URLのクエリパラメータも変更
      const query = Object.assign({}, this.$route.query)
      query.priority = this.priorityFilterVal
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
      const TASK_API = `/api/v1/tasks?page=${this.currentPage}&status=${this.statusFilterVal}&priority=${this.priorityFilterVal}`
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

    async submitTask(editFormData: TaskForm) {
      try {
        const POST_TASK_API = "/api/v1/tasks"
        const response = await this.$axios.$post(POST_TASK_API, editFormData)
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
  },
})
</script>

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}

.filter-list {
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px 0;
}
</style>
