<template>
  <div>
    <app-nav-bar />
    <b-container>
      <NuxtLink to="/timeline/2021/spring">2021/spring</NuxtLink>
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
