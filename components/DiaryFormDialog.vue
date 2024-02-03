<template>
  <v-dialog v-model="showDiaryForm" max-width="500px" @click:outside="closeFormDialog">
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
            v-model="diaryForm.is_public"
            label="一般公開する"
            :input-value="diaryForm.is_public"
          ></v-checkbox>
          <SelectImage
            :callback-func="addToDiariesImageRelation"
            :selected-images="selectedImagesArray(diaryForm.diaries_image_relations)"
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
  is_public: boolean
  date: string
  diaries_image_relations: string
}

@Component
export default class AddDiaryFormDialog extends Vue {
  @Prop({ type: Object, required: true })
  diaryForm: DiaryForm

  @Prop({ type: Boolean, required: true })
  showDiaryForm: boolean

  selectedImagesArray(selectedImages: string): number[] {
    try {
      return JSON.parse(selectedImages)
    } catch (error) {
      console.error("Invalid selectedImages format")
      return []
    }
  }

  selectedImagesString(selectedImages: number[]): string {
    try {
      return JSON.stringify(selectedImages)
    } catch (error) {
      console.error("Invalid selectedImages format")
      return "[]"
    }
  }

  selectedDiariesImageRelation: number[] = []

  addToDiariesImageRelation(selectedImageIds: number[]) {
    // 配列を初期化
    this.selectedDiariesImageRelation = []
    // 選択された画像のimage_idをdiaries_image_relationに追加する処理]
    this.selectedDiariesImageRelation = selectedImageIds.slice()
  }

  submitDiary() {
    // フォームの入力内容を親コンポーネントに送信する
    this.diaryForm.diaries_image_relations = this.selectedImagesString(
      this.selectedDiariesImageRelation
    )
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
