<template>
  <li class="ma-1 tag-nomal">
    {{ txt }}
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

@Component
export default class Tag extends Vue {
  @Prop({ type: String, required: true })
  txt: string
}
</script>

<style scoped>
.tag-nomal {
  background-color: #ebeced;
  border-radius: 0 2px 2px 0;
  color: #55606a;
  display: inline-block;
  font-size: 0.8rem;
  line-height: 1.4rem;
  margin: 3px 4px 3px 8px;
  padding: 0 6px 0 8px;
  position: relative;
  text-decoration: none;
}
</style>
