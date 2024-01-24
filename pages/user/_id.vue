<template>
  <v-container fluid>
    <div class="contents-main">
      <v-row justify="justify-space-between mb-3">
        <v-col cols="12">
          <h1>ユーザー情報</h1>
        </v-col>
      </v-row>
      <Userinfo :user="user" />
    </div>
    <div class="side-contents"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { User } from "@/@types/common"
import Userinfo from "@/components/user/Userinfo.vue"

export default Vue.extend({
  components: {
    Userinfo,
  },
  async asyncData({ $axios, params }) {
    const USER_API = "/api/v1/users/" + `${params.id}`
    const userRes = await $axios.$get(USER_API)

    return {
      user: userRes.data,
    }
  },
  data() {
    return {
      user: {} as User,
    }
  },
})
</script>

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}
</style>
