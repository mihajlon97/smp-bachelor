<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'App',
	data() {
		return {}
	},
	methods: {
		...mapActions(['fetchPresentations']),
	},
	mounted() {
		this.fetchPresentations()
	}
}
</script>

<style>
  body {
	  margin: 0!important;
  }
</style>
