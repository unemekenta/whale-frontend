<template>
  <v-container fluid>
    <div class="contents-main">
      <div>
        <h1>{{ serviceName }}について</h1>
        <section class="section-01">
          <div class="container container-left">
            <p>{{ serviceDescription }}</p>
            <p>
              あなたの夢や目標を実現するために、<br />日々の出来事や感情、<br />やりたいことややったことを記録しましょう。
            </p>
          </div>
          <div class="container container-right">
            <imageBasic :src="require('@/static/images/about/about01.png')" />
          </div>
        </section>

        <section class="section-02">
          <div class="container container-left">
            <imageBasic :src="require('@/static/images/about/about02.png')" />
          </div>
          <div class="container container-right">
            <p>{{ serviceName }}は、以下のようなメリットを提供します。</p>
            <ul>
              <li>
                日記を書くことで、自分の気持ちや考えを整理し、ストレスを軽減できます。また、日記には記憶力や創造力を高める効果もあります。
              </li>
              <li>
                タスク管理を行うことで、自分の時間や行動を効率的に管理できます。また、タスクを達成することで、自信や満足感を得られます。
              </li>
              <li>
                日記とタスク管理を組み合わせることで、自分の夢や目標に向かって計画的に進めることができます。
              </li>
            </ul>
          </div>
        </section>

        <section class="section-03">
          <div class="container container-left">
            <p>
              その他にも{{
                serviceName
              }}は、<br />シンプルで使いやすいデザインと機能を備えており、<br />あなたの夢や目標を応援します。
            </p>
          </div>
          <div class="container container-right">
            <imageBasic :src="require('@/static/images/about/about03.png')" />
          </div>
        </section>
      </div>
    </div>
    <div class="side-contents"></div>
  </v-container>
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
      serviceName: "Dream Diary",
      serviceDescription: "Dream Diaryは、日記とタスク管理が行えるwebサービスです。",
    }
  },
})
</script>

<style lang="scss" scoped>
.contents-main {
  max-width: 800px;
}

.section-01,
.section-02,
.section-03 {
  margin: 40px 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr;
    place-content: center;
  }
}

h1 {
  margin-bottom: 16px;
}

li {
  margin-bottom: 8px;
}

img {
  max-width: 100%;
  margin-bottom: 20px;
}
</style>
