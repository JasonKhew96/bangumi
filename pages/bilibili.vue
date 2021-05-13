<template>
  <div>
    <app-nav-bar />
    <b-container>
      <app-bilibili-overseas />
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppNavBar from '~/components/AppNavBar.vue'
import AppBilibiliOverseas from '~/components/AppBilibiliOverseas.vue'
export default Vue.extend({
  components: {
    AppNavBar,
    AppBilibiliOverseas,
  },
})
</script>
