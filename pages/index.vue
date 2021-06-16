<template>
  <div>
    <app-nav-bar />
    <b-container>
      <p><NuxtLink to="/timeline/2021/spring/">2021/spring (TEST)</NuxtLink></p>
      <p><NuxtLink to="/timeline/2021/summer/">2021/summer (TEST)</NuxtLink></p>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppNavBar from '~/components/AppNavBar.vue'

export default Vue.extend({
  components: { AppNavBar },
})
</script>
