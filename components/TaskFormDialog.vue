<template>
  <v-dialog v-model="showTaskForm" max-width="500px" @click:outside="closeDialog">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="submitTask">
          <v-text-field v-model="taskFormForSubmit.title" label="タイトル" required />
          <v-textarea v-model="taskFormForSubmit.description" label="詳細" />
          <v-select
            v-model="taskFormForSubmit.priority"
            label="優先度"
            :items="prioritySubmitOptions"
          ></v-select>
          <v-select
            v-model="taskFormForSubmit.status"
            label="ステータス"
            :items="statusSubmitOptions"
          ></v-select>
          <v-text-field
            v-model="taskFormForSubmit.deadline"
            label="完了予定日"
            type="datetime-local"
          />
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

          <v-text-field v-model="inputName" label="タグ追加" class="mx-7 my-1" @input="searchTag" />
          <v-list v-if="inputName.length > 0 && suggestTags.length > 0" class="mx-7 my-0">
            <!-- <v-subheader>タグ候補</v-subheader> -->
            <v-list-item-group>
              <v-list-item v-for="(tag, index) in suggestTags" :key="index" @click="addTag(tag)">
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

          <v-btn type="submit" color="primary">保存</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Tag, Tagging } from "@/@types/common"
import { TaskForm } from "@/@types/task"
import {
  statusOptions,
  priorityOptions,
  statusSubmitOptions,
  prioritySubmitOptions,
} from "@/plugins/options"

export default Vue.extend({
  props: {
    showTaskForm: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    taskForm: {
      type: Object as PropType<TaskForm>,
      required: true,
    },
    selectedTags: {
      type: Array as PropType<Tag[]>,
      required: true,
    },
  },
  data() {
    return {
      priorityItems: ["low", "medium", "high"],
      selectedImage: null,
      statusOptions,
      priorityOptions,
      statusSubmitOptions,
      prioritySubmitOptions,
      inputName: "",
      suggestTags: [] as Tag[],
      taskFormForSubmit: {} as TaskForm,
      selectedTagsForSubmit: [] as Tag[],
    }
  },
  watch: {
    // taskFormプロパティが変更されたときに呼ばれる
    taskForm: {
      handler() {
        this.copyTaskForm()
      },
      deep: true,
    },
    // selectedTagsプロパティが変更されたときに呼ばれる
    selectedTags: {
      handler() {
        this.copySelectedTags()
      },
      deep: true,
    },
  },
  methods: {
    async searchTag() {
      const SEARCH_TAG_API = "/api/v1/tags/search?keyword=" + this.inputName
      const response = await this.$axios.$get(SEARCH_TAG_API)
      this.suggestTags = response.data.tags
    },

    removeTag(tag: Tag) {
      const index = this.selectedTagsForSubmit.indexOf(tag)
      if (index !== -1) {
        this.selectedTagsForSubmit.splice(index, 1)
      }
    },

    addTag(tag: Tag) {
      this.selectedTagsForSubmit.push(tag)
    },

    copyTaskForm() {
      this.taskFormForSubmit = Object.assign({}, this.taskForm)
    },

    copySelectedTags() {
      this.selectedTagsForSubmit = this.selectedTags
    },

    initTaskFormForSubmit() {
      this.taskFormForSubmit = {
        id: 0,
        title: "",
        description: "",
        priority: "",
        status: "",
        deadline: new Date().toLocaleDateString(),
        taggings: [] as Tagging[],
      }
    },

    initSelectedTagsForSubmit() {
      this.selectedTagsForSubmit = []
    },

    submitTask() {
      this.selectedTagsForSubmit.forEach((tag: Tag) => {
        this.taskFormForSubmit.taggings.push({ tag_id: tag.id })
      })

      try {
        this.$emit("submitDiaryForm", this.taskFormForSubmit)
        this.initTaskFormForSubmit()
        this.initSelectedTagsForSubmit()
      } catch (error) {
        console.error(error)
      }
    },
    closeDialog() {
      this.$emit("close")
    },
  },
})
</script>
