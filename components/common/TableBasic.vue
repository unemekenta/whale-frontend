<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="itemPerPage"
      class="elevation-1"
    >
      <template #item.status="{ item }">
        <slot :item="item" name="status" />
      </template>
      <template #item.title="{ item }">
        <slot :item="item" name="title" />
      </template>
      <template #item.actions="{ item }">
        <slot :item="item" name="actions" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

@Component
export default class TableBasic extends Vue {
  @Prop({ type: Array, required: true })
  headers: object

  @Prop({ type: Array, required: true })
  items: object

  @Prop({ type: Number, required: false })
  itemPerPage: Number
}
</script>
