<template>
  <div class="user-info-container">
    <div class="header">
      <ImageBasic
        v-if="user.image.url"
        :src="user.image.url"
        :aspect-ratio="1"
        alt="avatarImage"
        class="avatar-image"
        width="80"
        height="80"
      />
      <ImageBasic
        v-else
        :src="require('@/assets/images/common/icon-user.png')"
        :aspect-ratio="1"
        alt="avatarImage"
        class="avatar-image"
        width="80"
        height="80"
      />
      <div class="header-text">
        <p class="nickname">{{ user.nickname }}</p>
      </div>
    </div>
    <div class="info-list">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="introduction" v-html="formattedIntroduction"></p>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { User } from "@/@types/common"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  computed: {
    formattedIntroduction() {
      return this.user.introduction.replace(/\n/g, "<br>")
    },
  },
})
</script>

<style lang="scss" scoped>
.user-info-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  .header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;

    &-text {
      font-size: $font-super-large;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0;
    }
  }
  .info-list {
    .introduction {
      line-height: $line-height-normal;
    }
  }
}
.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
