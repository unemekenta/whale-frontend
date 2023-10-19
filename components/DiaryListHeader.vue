<template>
  <div class="diary-list-header">
    <p class="contents hide-below-pc"></p>
    <p class="contents">タイトル</p>
    <p class="contents">ステータス</p>
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
  grid-template-columns: 1fr 6fr 1fr 1fr;
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 5fr 3fr 1fr;
  }
  gap: 10px; /* グリッドアイテム間の隙間を設定（必要に応じて調整） */
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
  .contents {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
</style>
