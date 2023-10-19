<template>
  <nuxt-link :to="'/task/detail/' + task.id" class="task-item text-decoration-none">
    <div class="chip-list">
      <v-chip class="font-weight-bold chip" :color="getStatusColor(task.status)" dark>
        {{ fmtStatus(task.status) }}
      </v-chip>
      <div :class="'text-color-' + getPriorityColor(task.priority)">
        {{ fmtPriority(task.priority) }}
      </div>
    </div>
    <div class="info-list">
      <p class="info-title">
        {{ task.title }}
      </p>
      <p class="info-date">{{ fmtDateWithoutTime }}</p>
    </div>
    <div class="button-list">
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
  align-items: center;
  display: grid;
  gap: 2px;
  grid-template-columns: 2fr 10fr 1fr; /* 5つの要素を横並びに配置 */
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 3fr 9fr 1fr;
    gap: 8px;
  }
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
  .chip-list {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    @media screen and (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 0;
    }
    .chip {
      font-size: $font-small;
      display: flex;
      justify-content: center;
    }
    .text-color {
      &-red {
        color: $color-red;
      }
      &-orange {
        color: $color-orange;
      }
      &-blue {
        color: $color-blue;
      }
      &-green {
        color: $color-green;
      }
    }
  }
  .info-list {
    display: grid;
    grid-template-columns: 4fr 1fr;
    gap: 4px;
    @media screen and (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      text-align: left;
      row-gap: 10px;
    }
    .info-title,
    .info-date {
      display: inline-block;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    .info-title {
      @media screen and (max-width: $breakpoint-md) {
        font-size: $font-middle;
      }
    }
    .info-date {
      @media screen and (max-width: $breakpoint-md) {
        font-size: $font-small;
      }
    }
  }
  .button-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }
}
</style>
