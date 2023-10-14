<template>
  <nuxt-link :to="'/task/detail/' + task.id" class="task-item text-decoration-none">
    <v-chip class="font-weight-bold chip" :color="getStatusColor(task.status)" dark>
      {{ fmtStatus(task.status) }}
    </v-chip>
    <v-chip
      label
      outlined
      class="font-weight-bold chip"
      :color="getPriorityColor(task.priority)"
      dark
    >
      {{ fmtPriority(task.priority) }}
    </v-chip>
    <p class="contents">{{ task.title }}</p>
    <p class="contents">{{ fmtDateWithoutTime }}</p>
    <div class="contents">
      <v-btn icon @click.prevent="editTask(task.id)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click.prevent="deleteTask(task.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Task } from "@/@types/common"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import {
  statusFilter,
  statusColor,
  priorityFilter,
  priorityColor,
} from "@/plugins/filter/label-filter"

export default Vue.extend({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  computed: {
    fmtDateWithoutTime() {
      return dateWithoutTimeFilter(this.task.deadline)
    },
  },
  methods: {
    editTask(diaryId: number) {
      this.$emit("editTask", diaryId)
    },
    deleteTask(diaryId: number) {
      this.$emit("deleteTask", diaryId)
    },
    fmtStatus(status: string) {
      return statusFilter(status)
    },
    getStatusColor(status: string): string {
      return statusColor(status)
    },
    fmtPriority(priority: string) {
      return priorityFilter(priority)
    },
    getPriorityColor(priority: string): string {
      return priorityColor(priority)
    },
  },
})
</script>

<style lang="scss" scoped>
.task-item {
  font-size: $font-middle;
  display: grid;
  grid-template-columns: 1fr 1fr 7fr 1fr 1fr; /* 5つの要素を横並びに配置 */
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
  gap: 10px; /* グリッドアイテム間の隙間を設定（必要に応じて調整） */
  border-bottom: 1px solid #ccc;
  padding: 8px;
  .chip {
    font-size: $font-small;
    display: flex;
    justify-content: center;
  }
  .contents {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
</style>
