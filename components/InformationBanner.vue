<template>
  <v-banner two-line class="mb-4">
    <v-avatar slot="icon" color="primary" size="40">
      <v-icon class="notification-icon" color="white">mdi-bell</v-icon>
    </v-avatar>

    {{ txt }}

    <template v-if="link" #actions>
      <v-btn text color="primary" @click="handleLearnMore">LEARN MORE</v-btn>
    </template>
  </v-banner>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

@Component
export default class InformationBanner extends Vue {
  @Prop({ type: String, required: true })
  txt: string

  @Prop({ type: String, required: false })
  link: string

  handleLearnMore(): void {
    if (this.link) {
      window.location.href = this.link // リンクに遷移
    }
  }
}
</script>
