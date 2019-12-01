<template>
  <div id="app">
	<router-link to="/" tag="h1"> Smart Image Presenter </router-link>
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
  /* CSS */
</style>
