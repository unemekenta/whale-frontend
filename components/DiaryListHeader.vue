<template>
  <div class="diary-list-header">
    <p class="contents hide-below-pc"></p>
    <p class="contents">タイトル</p>
    <p class="contents">日付</p>
    <p class="contents">公開ステータス</p>
    <p class="contents"></p>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.diary-list-header {
  font-size: $font-middle;
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 1fr 1fr;
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 2fr 1fr 2fr 1fr;
  }
  gap: 10px; /* グリッドアイテム間の隙間を設定（必要に応じて調整） */
  border-bottom: 1px solid #ccc;
  padding: 8px;
  .contents {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
</style>
