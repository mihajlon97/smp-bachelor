<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script>
	import {mapActions} from 'vuex'

	export default {
	name: 'App',
	methods: {
		...mapActions(['fetchPresentations']),
	},
	async mounted() {
		const path = require('electron').remote.app.getPath('userData') + '\\presentations.xlsx';
		const fs = require('fs');

		console.log(require('electron').remote.app.getPath('userData'));

		if (!fs.existsSync(path)) {
			const XLSX = require('xlsx');
			const book = XLSX.utils.book_new();
			const sheet1 = XLSX.utils.aoa_to_sheet([['id', 'name', 'file']]);
			XLSX.utils.book_append_sheet(book, sheet1, 'sheet1');
			XLSX.writeFile(book, path);
		}
	    this.fetchPresentations();
	}
}
</script>

<style>
  body {
	  margin: 0!important;
  }
</style>
