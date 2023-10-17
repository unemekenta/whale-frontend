<template>
  <div class="task-list-header">
    <p class="contents"></p>
    <p class="contents">タイトル</p>
    <p class="contents">日付</p>
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
  grid-template-columns: 1fr 10fr 1fr 1fr; /* 5つの要素を横並びに配置 */
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 1fr 4fr 2fr 2fr;
  }
  border-bottom: 1px solid #ccc;
  padding: 8px;
  .contents {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
</style>
