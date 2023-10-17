<template>
  <v-container fluid>
    <v-row justify="justify-space-between" class="align-center">
      <v-col>
        <v-file-input
          v-model="selectedFileData"
          label="画像を選択"
          accept="image/*"
          @change="changeFile"
        ></v-file-input>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    selectedFile: {
      type: File,
      required: false,
      default: null,
    },
    callbackFunc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selectedFileData: this.selectedFile, // 画像ファイルを保持するデータ
    }
  },
  methods: {
    changeFile(event: any): void {
      // ファイルが選択されたときに実行されるメソッド
      const file = event
      if (file) {
        this.callbackFunc(file)
      }
    },
  },
})
</script>
