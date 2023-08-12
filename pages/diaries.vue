<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="6">
        <h1>日記</h1>
      </v-col>
      <v-col cols="6" class="my-auto">
        <v-row justify="end">
          <v-btn class="ma-3" color="primary" @click="openAddDialog">日記をつける</v-btn>
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
    <v-row class="mx-1">
      <v-col v-if="diaries.length === 0" cols="12">
        <p>現在、日記はありません。</p>
      </v-col>
      <v-col v-else cols="12" class="px-0">
        <TableBasic :headers="headers" :items="diariesTableList">
          <template #title="{ item }">
            <nuxt-link :to="'/diary/detail/' + item.id" class="text-decoration-none">
              {{ item.title }}
            </nuxt-link>
          </template>
          <template #actions="{ item }">
            <v-btn icon @click.prevent="editDiary(item.id)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon @click.prevent="deleteDiary(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
        </TableBasic>
      </v-col>
    </v-row>

    <!-- 新規追加フォーム -->
    <DiaryFormDialog
      :show-diary-form="showDiaryForm"
      :diary-form="diaryForm"
      @submitDiaryForm="submitDiary"
      @closeDialog="closeAddDialog"
    />

    <!-- 編集フォーム -->
    <DiaryFormDialog
      :show-diary-form="showEditDiaryForm"
      :diary-form="editDiaryForm"
      @submitDiaryForm="updateDiary"
      @closeDialog="closeEditDialog"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { stringToISOString } from "@/plugins/date-format"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import { Diary, DiariesImageRelation } from "@/@types/common"
import TableBasic from "@/components/common/TableBasic.vue"
import { DiaryListTable } from "@/@types/diary"

@Component({
  components: {
    TableBasic,
  },

  async asyncData({ $axios }) {
    const DIARY_API = "/api/v1/diaries"
    const diaries = await $axios.$get(DIARY_API)
    return {
      diaries: diaries.data,
      diariesTableList: diaries.data.map(({ id, title, is_public, date }: DiaryListTable) => ({
        id,
        title,
        is_public,
        date: dateWithoutTimeFilter(date),
        actions: "",
      })),
    }
  },
})
export default class DiaryList extends Vue {
  diaries: Diary[] = []
  diariesTableList: DiaryListTable[] = []

  selectedDiary: Diary | null = null

  headers = [
    { text: "タイトル", value: "title" },
    { text: "一般公開", value: "is_public" },
    { text: "日付", value: "date" },
    { text: "", value: "actions" },
  ]

  showDiaryForm = false
  showEditDiaryForm = false
  displaySuccessModal = false
  successModalTxt = ""
  displayErrorModal = false
  errorModalTxt = ""

  diaryForm = {
    id: 0,
    title: "",
    content: "",
    is_public: false,
    date: "",
    uid: "",
    diaries_image_relations: "",
  }

  editDiaryForm = {
    id: 0,
    title: "",
    content: "",
    is_public: false,
    date: "",
    diaries_image_relations: "",
  }

  fmtDateWithoutTime(date: string) {
    return dateWithoutTimeFilter(date)
  }

  openAddDialog() {
    this.showDiaryForm = true
  }

  closeAddDialog() {
    this.showDiaryForm = false
  }

  openEditDialog() {
    this.showEditDiaryForm = true
  }

  closeEditDialog() {
    this.showEditDiaryForm = false
  }

  async fetchDiaries() {
    // // 日記一覧をAPIから取得する
    const DIARY_API = "/api/v1/diaries"
    const diaries = await this.$axios.$get(DIARY_API)
    this.diaries = diaries.data
    this.diariesTableList = diaries.data.map(({ id, title, is_public, date }: DiaryListTable) => ({
      id,
      title,
      is_public,
      date: dateWithoutTimeFilter(date),
      actions: "",
    }))
  }

  async editDiary(diaryId: number) {
    const EDIT_DIARY_API = "/api/v1/diaries/" + diaryId
    const res = await this.$axios.$get(EDIT_DIARY_API)
    this.editDiaryForm.id = diaryId
    this.editDiaryForm.title = res.data.title
    this.editDiaryForm.content = res.data.content
    this.editDiaryForm.is_public = res.data.is_public
    this.editDiaryForm.date = stringToISOString(res.data.date)
    this.editDiaryForm.diaries_image_relations = JSON.stringify(
      res.data.diaries_image_relations.map((item: DiariesImageRelation) => {
        return item.image_id
      })
    )

    this.openEditDialog()
  }

  async deleteDiary(diaryId: number) {
    try {
      const DELETE_DIARY_API = "/api/v1/diaries/" + diaryId
      const response = await this.$axios.$delete(DELETE_DIARY_API)
      this.successModalTxt = response.data.title + "を削除しました。"
      this.displaySuccessModal = true
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000)
      this.fetchDiaries()
    } catch (error) {
      this.errorModalTxt = "削除に失敗しました。"
      this.displayErrorModal = true
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }

  async submitDiary() {
    try {
      const POST_DIARY_API = "/api/v1/diaries"
      const response = await this.$axios.$post(POST_DIARY_API, this.diaryForm)
      this.successModalTxt = response.data.title + "を登録しました。"
      this.displaySuccessModal = true
      this.closeAddDialog()
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000)
      this.fetchDiaries()
    } catch (error) {
      this.errorModalTxt = "登録に失敗しました。"
      this.displayErrorModal = true
      this.closeAddDialog()
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }

  async updateDiary() {
    try {
      const UPDATE_DIARY_API = "/api/v1/diaries/" + this.editDiaryForm.id
      const response = await this.$axios.$put(UPDATE_DIARY_API, this.editDiaryForm)
      this.successModalTxt = response.data.title + "を更新しました。"
      this.displaySuccessModal = true
      this.closeEditDialog()
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000)
      this.fetchDiaries()
    } catch (error) {
      this.errorModalTxt = "更新に失敗しました。"
      this.displayErrorModal = true
      this.closeEditDialog()
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000)
    }
  }
}
</script>
