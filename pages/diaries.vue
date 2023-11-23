<template>
  <v-container fluid>
    <div class="contents-main">
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
          <DiaryListHeader />
          <div v-for="(diary, index) in diaries" :key="index">
            <DiaryListItem :diary="diary" @editDiary="editDiary" @deleteDiary="deleteDiary" />
          </div>
        </v-col>
      </v-row>
      <PagiNationComponent :pages="pages" :current-page="currentPage" @changePage="changePage" />

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
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { stringToISOString } from "@/plugins/date-format"
import { dateWithoutTimeFilter } from "@/plugins/filter/date-filter"
import { Diary, DiariesImageRelation, PagiNation } from "@/@types/common"
import TableBasic from "@/components/common/TableBasic.vue"
import PagiNationComponent from "@/components/common/PagiNation.vue"
import DiaryListItem from "@/components/DiaryListItem.vue"
import DiaryListHeader from "@/components/DiaryListHeader.vue"
import { DiaryListTable } from "@/@types/diary"

export default Vue.extend({
  components: {
    TableBasic,
    DiaryListItem,
    DiaryListHeader,
    PagiNationComponent,
  },
  middleware: "authenticated",
  async asyncData({ $axios, route }) {
    const page = route.query.page || 1
    const DIARY_API = `/api/v1/diaries?page=${page}`
    const diaries = await $axios.$get(DIARY_API)
    return {
      diaries: diaries.data.diaries,
      diariesTableList: diaries.data.diaries.map(
        ({ id, title, is_public, date }: DiaryListTable) => ({
          id,
          title,
          is_public,
          date: dateWithoutTimeFilter(date),
          actions: "",
        })
      ),
      pagination: diaries.data.pagination,
    }
  },
  data() {
    return {
      diaries: [] as Diary[],
      diariesTableList: [] as DiaryListTable[],
      pagination: {} as PagiNation,

      selectedDiary: null as Diary | null,

      headers: [
        { text: "タイトル", value: "title" },
        { text: "一般公開", value: "is_public" },
        { text: "日付", value: "date" },
        { text: "", value: "actions" },
      ],

      showDiaryForm: false,
      showEditDiaryForm: false,
      displaySuccessModal: false,
      successModalTxt: "",
      displayErrorModal: false,
      errorModalTxt: "エラーが発生しました",

      diaryForm: {
        id: 0,
        title: "",
        content: "",
        is_public: false,
        date: new Date().toLocaleDateString(),
        uid: "",
        diaries_image_relations: "",
      },

      editDiaryForm: {
        id: 0,
        title: "",
        content: "",
        is_public: false,
        date: new Date().toLocaleDateString(),
        diaries_image_relations: "",
      },
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
    fmtDateWithoutTime(date: string) {
      return dateWithoutTimeFilter(date)
    },

    openAddDialog() {
      this.showDiaryForm = true
    },

    closeAddDialog() {
      this.showDiaryForm = false
    },

    openEditDialog() {
      this.showEditDiaryForm = true
    },

    closeEditDialog() {
      this.showEditDiaryForm = false
    },

    async changePage(pageInt: number) {
      this.pagination.current_page = pageInt
      // URLのクエリパラメータも変更
      const query = Object.assign({}, this.$route.query)
      query.page = pageInt.toString()
      await this.$router.push({ query })
      this.fetchDiaries()
    },

    async fetchDiaries() {
      const DIARY_API = `/api/v1/diaries?page=${this.currentPage}`
      const diariesRes = await this.$axios.$get(DIARY_API)
      this.diaries = diariesRes.data.diaries
      this.diariesTableList = diariesRes.data.diaries.map(
        ({ id, title, is_public, date }: DiaryListTable) => ({
          id,
          title,
          is_public,
          date: dateWithoutTimeFilter(date),
          actions: "",
        })
      )
      this.pagination = Object.assign({}, diariesRes.data.pagination)
    },

    async editDiary(diaryId: number) {
      const EDIT_DIARY_API = "/api/v1/diaries/" + diaryId + "/edit"
      const res = await this.$axios.$get(EDIT_DIARY_API)
      this.editDiaryForm.id = diaryId
      this.editDiaryForm.title = res.data.diary.title
      this.editDiaryForm.content = res.data.diary.content
      this.editDiaryForm.is_public = res.data.diary.is_public
      this.editDiaryForm.date = stringToISOString(res.data.diary.date)
      this.editDiaryForm.diaries_image_relations = JSON.stringify(
        res.data.diary.diaries_image_relations.map((item: DiariesImageRelation) => {
          return item.image_id
        })
      )

      this.openEditDialog()
    },

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
    },

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
    },

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
    },
  },
})
</script>

<style scoped>
.contents-main {
  max-width: 800px;
}
</style>
