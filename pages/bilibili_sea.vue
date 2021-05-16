<template>
  <div>
    <app-nav-bar />
    <b-container>
      <app-bilibili-SEA />
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppNavBar from '~/components/AppNavBar.vue'
import AppBilibiliSEA from '~/components/AppBilibiliSEA.vue'
export default Vue.extend({
  components: {
    AppNavBar,
    AppBilibiliSEA,
  },
})
</script>
