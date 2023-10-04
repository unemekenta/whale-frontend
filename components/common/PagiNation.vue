<template>
  <v-row justify="center" class="pager-wrapped">
    <nav>
      <ul>
        <li v-for="page in pages" :key="page">
          <a :class="{ active: currentPage === page }" @click.prevent="changePage(page)">{{
            page
          }}</a>
        </li>
      </ul>
    </nav>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

export default Vue.extend({
  props: {
    pages: {
      type: Array as PropType<number[]>,
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  methods: {
    changePage(pageInt: number) {
      this.$emit("changePage", pageInt)
    },
  },
})
</script>

<style lang="scss" scoped>
.pager-wrapped {
  margin: 20px 0;

  nav ul {
    display: inline-block;
    padding: 0;
    margin: 0;
  }

  nav li {
    display: inline-block;
    margin: 0;
    padding: 0;
  }

  nav a {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 5px;
    border-radius: 3px;
    color: $color-primary;
    background-color: $color-gray;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
  }

  nav a:hover {
    background-color: $color-surface;
  }

  nav a.active {
    background-color: $color-accent;
    color: $color-font;
  }
}
</style>
