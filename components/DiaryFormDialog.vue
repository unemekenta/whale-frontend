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
          <SelectImage
            :callback="addToDiariesImageRelation"
            :selected-images="diaryForm.diaries_image_relations"
          />
          <v-btn type="submit" color="primary" class="mt-2">保存</v-btn>
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
  diaries_image_relations: string
}

@Component
export default class AddDiaryFormDialog extends Vue {
  @Prop({ type: Object, required: true })
  diaryForm: DiaryForm

  @Prop({ type: Boolean, required: true })
  showDiaryForm: boolean

  selectedDiariesImageRelation: number[] = []

  addToDiariesImageRelation(selectedImageIds: number[]) {
    // 配列を初期化
    this.selectedDiariesImageRelation = []
    // 選択された画像のimage_idをdiaries_image_relationに追加する処理]
    selectedImageIds.forEach((imageId) => {
      this.selectedDiariesImageRelation.push(imageId)
    })
  }

  submitDiary() {
    // フォームの入力内容を親コンポーネントに送信する
    const uid = window.localStorage.getItem("uid")
    if (uid === null) {
      return
    }
    this.diaryForm.uid = uid
    this.diaryForm.diaries_image_relations = JSON.stringify(this.selectedDiariesImageRelation)
    try {
      this.$emit("submitDiaryForm", this.diaryForm)
    } catch (error) {
      console.error(error)
    }
  }

  closeFormDialog() {
    this.$emit("closeDialog")
  }
}
</script>
