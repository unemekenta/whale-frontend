<template>
  <v-app dark class="components">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      class="sidebar-componment"
      fixed
      app
      color="primary"
    >
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="secondary" class="header-componment">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-img
        :src="require('@/assets/images/common/logo-white.png')"
        alt="logo"
        class="logo-image"
        height="auto"
        max-width="150px"
        decoding="async"
      />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title>{{ title }}</v-toolbar-title> -->
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt class="main-container" />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import ImageBasic from "@/components/common/ImageBasic.vue"

export default Vue.extend({
  components: {
    ImageBasic,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "ホーム",
          to: "/",
        },
        {
          icon: "mdi-checkbox-marked",
          title: "目標を管理する",
          to: "/tasks",
        },
        {
          icon: "mdi-book-open",
          title: "日記を書く",
          to: "/diaries",
        },
        {
          icon: "mdi-folder-image",
          title: "画像フォルダ",
          to: "/images",
        },
        {
          icon: "mdi-cog",
          title: "マイページ・設定",
          to: "/mypage",
        },
        {
          icon: "mdi-information",
          title: "Dream Diaryとは",
          to: "/about",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Dream Diary",
    }
  },
})
</script>

<style lang="scss" scoped>
.components {
  font-family: $font-family-base, sans-serif;
}

.main-container {
  padding: 5px 20px;
  @media screen and (max-width: $breakpoint-md) {
    padding: 0px;
  }
}

.sidebar-componment div,
.sidebar-componment a,
.sidebar-componment p,
.sidebar-componment i,
.header-componment div,
.header-componment a,
.header-componment p,
.header-componment i {
  color: #ffffff !important;
}
</style>
