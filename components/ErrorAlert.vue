<template>
  <v-alert
    type="error"
    dense
    class="alert"
  >
  {{ txt }}
  </v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ErrorAlert extends Vue {
  @Prop({ type: String, required: true })
  txt: string
}

</script>