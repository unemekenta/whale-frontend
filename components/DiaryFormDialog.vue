<template>
  <v-dialog v-model="showDiaryForm" max-width="500px">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>日記を書く</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeFormDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="submitDiary">
          <v-text-field v-model="diaryForm.title" label="タイトル"></v-text-field>
          <v-textarea v-model="diaryForm.content" label="詳細"></v-textarea>
          <v-text-field v-model="diaryForm.date" label="日付" type="datetime-local" />
          <v-checkbox
            v-model="diaryForm.public"
            label="一般公開する"
            :input-value="diaryForm.public"
          ></v-checkbox>
          <v-btn type="submit" color="primary" class="mt-2">追加する</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

interface DiaryForm {
  id: number
  title: string
  content: string
  public: boolean
  date: string
  uid: string
}

@Component
export default class AddDiaryFormDialog extends Vue {
  @Prop({ type: Object, required: true })
  diaryForm: DiaryForm

  @Prop({ type: Boolean, required: true })
  showDiaryForm: boolean

  submitDiary() {
    // フォームの入力内容を親コンポーネントに送信する
    const uid = window.localStorage.getItem("uid")
    if (uid === null) {
      return
    }
    this.diaryForm.uid = uid
    this.$emit("submitDiaryForm", this.diaryForm)
  }

  closeFormDialog() {
    this.$emit("closeDialog")
  }
}
</script>
