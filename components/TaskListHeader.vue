<template>
  <div class="task-list-header">
    <p class="contents">ステータス</p>
    <p class="contents">タイトル</p>
    <p class="contents"></p>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.task-list-header {
  font-size: $font-middle;
  display: grid;
  gap: 2px;
  grid-template-columns: 2fr 10fr 1fr; /* 5つの要素を横並びに配置 */
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 3fr 9fr 1fr;
  }
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
  .contents {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
</style>
