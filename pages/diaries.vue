<template>
  <v-container fluid>
    <v-row justify="justify-space-between">
      <v-col cols="12" md="6">
        <h1>日記一覧</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-row justify="end">
          <div class="ma-3" v-if="displaySuccessModal">
            <SuccessAlert :txt="successModalTxt" transition="fade-transition"/>
          </div>
          <div class="ma-3" v-if="displayErrorModal">
            <ErrorAlert :txt="errorModalTxt"/>
          </div>
          <v-btn class="ma-3" color="primary" @click="showDiaryForm = true">日記をつける</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row>
      <v-col cols="12" v-if="diaries.length === 0">
        <p>現在、日記はありません。</p>
      </v-col>
      <v-col cols="12" v-else>
        <v-list>
          <v-list-item-group v-model="selectedDiary">
            <v-list-item
              v-for="diary in diaries"
              :key="diary.id"
            >
              <v-list-item-content>
                <nuxt-link :to="'/diary/detail/' + diary.id" class="text-decoration-none">
                  <v-list-item-title>{{ diary.date | toDateWithoutTime }}</v-list-item-title>
                  <v-list-item-title>{{ diary.title }}</v-list-item-title>
                </nuxt-link>
              </v-list-item-content>
              <v-list-item-action @click="editDiary(diary)">
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-action>
              <v-list-item-action @click="deleteDiary(diary)">
                <v-icon>mdi-delete</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>

    <!-- 新規追加フォーム -->
    <v-dialog v-model="showDiaryForm" max-width="500px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>日記を書く</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showDiaryForm = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="submitDiary">
            <v-text-field v-model="diaryForm.title" label="タイトル"></v-text-field>
            <v-textarea v-model="diaryForm.content" label="詳細"></v-textarea>
            <v-text-field
              v-model="diaryForm.date"
              label="日付"
              type="datetime-local"
            />
            <v-checkbox
              v-model="diaryForm.public"
              label="一般公開する"
              value="true"
            ></v-checkbox>
            <v-btn type="submit" color="primary" class="mt-2">追加する</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 編集フォーム -->
    <v-dialog v-model="showEditDiaryForm" max-width="500px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>日記を編集する</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showEditDiaryForm = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="updateDiary">
            <v-text-field v-model="editDiaryForm.title" label="タイトル"></v-text-field>
            <v-textarea v-model="editDiaryForm.content" label="詳細"></v-textarea>
            <v-text-field
              v-model="editDiaryForm.date"
              label="日付"
              type="datetime-local"
            />
            <v-checkbox
              v-model="editDiaryForm.public"
              label="一般公開する"
            ></v-checkbox>
            <v-btn type="submit" color="primary" class="mt-2">保存</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DateFormat from '@/plugins/date-format'

interface Diary {
  id: number;
  title: string;
  content: string;
  public: boolean;
  date: string;
}

@Component({
async asyncData({$axios}) {
  const DIARY_API = "/api/v1/diaries"
  const diaries = await $axios.$get(DIARY_API)
  return {
    diaries: diaries.data
  }
}})

export default class DiaryList extends Vue {
  diaries: Diary[] = [];

  selectedDiary: Diary | null = null;

  showDiaryForm = false;
  showEditDiaryForm = false;
  displaySuccessModal = false;
  successModalTxt = '';
  displayErrorModal = false;
  errorModalTxt = '';

  diaryForm = {
    id: 0,
    title: '',
    content: '',
    public: false,
    date: '',
    uid: '',
  };

  editDiaryForm = {
    id: 0,
    title: '',
    content: '',
    public: false,
    date: '',
  };

  async fetchDiaries() {
    // // 日記一覧をAPIから取得する
    const DIARY_API = "/api/v1/diaries"
    const diaries = await this.$axios.$get(DIARY_API)
    this.diaries = diaries.data;
  }

  async editDiary(diary: Diary) {
    const EDIT_DIARY_API = "/api/v1/diaries/" + diary.id;
    const res = await this.$axios.$get(EDIT_DIARY_API);
    this.editDiaryForm.id = diary.id;
    this.editDiaryForm.title = res.data.title;
    this.editDiaryForm.content = res.data.content;
    this.editDiaryForm.public = res.data.public;
    this.editDiaryForm.date = DateFormat.stringToISOString(res.data.date);

    this.showEditDiaryForm = true;
  }

  async deleteDiary(diary: Diary) {
    const DELETE_DIARY_API = "/api/v1/diaries/" + diary.id;
    const response = await this.$axios.$delete(DELETE_DIARY_API);
    try {
      this.successModalTxt = response.data.title + 'を削除しました。';
      this.displaySuccessModal = true;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchDiaries()
    }
    catch(error) {
      this.errorModalTxt = '削除に失敗しました。';
      this.displayErrorModal = true;
      setTimeout(() => {
        this.displayErrorModal = false
      }, 4000);
    }
  }

  async submitDiary() {
    try {
      const uid = window.localStorage.getItem("uid");
      if (uid === null) {
        return
      };
      this.diaryForm.uid = uid;
      const POST_DIARY_API = "/api/v1/diaries";
      const response = await this.$axios.$post(POST_DIARY_API, this.diaryForm);
      this.successModalTxt = response.data.title + 'を登録しました。';
      this.displaySuccessModal = true;
      this.showDiaryForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false;
      }, 4000);
      this.fetchDiaries();
    }
    catch(error) {
      this.errorModalTxt = '登録に失敗しました。';
      this.displayErrorModal = true;
      this.showDiaryForm = false;
      setTimeout(() => {
        this.displayErrorModal = false;
      }, 4000);
    }
  }

  async updateDiary() {
    const UPDATE_DIARY_API = "/api/v1/diaries/" + this.editDiaryForm.id;
    const response = await this.$axios.$put(UPDATE_DIARY_API, this.editDiaryForm);
    try {
      this.successModalTxt = response.data.title + 'を更新しました。';
      this.displaySuccessModal = true;
      this.showEditDiaryForm = false;
      setTimeout(() => {
        this.displaySuccessModal = false
      }, 4000);
      this.fetchDiaries()
    }
    catch(error) {
      this.errorModalTxt = '更新に失敗しました。';
      this.displayErrorModal = true;
      this.showEditDiaryForm = false;
      setTimeout(() => {
        this.displayErrorModal = false;
      }, 4000);
    }
  }

}

</script>