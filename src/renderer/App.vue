<template>
  <div id="app">
	  <transition name="fade">
		  <router-view> </router-view>
	  </transition>
  </div>
</template>

<script>
	import { mapActions } from 'vuex'
	export default {
	name: 'App',
	methods: {
		...mapActions(['fetchPresentations']),
	},
	mounted() {
		const path = require('path').join(require('electron').remote.app.getPath('userData'), 'presentations.xlsx');
		/**
		 * If presentations excel file is not found in the electron's userData folder, create new empty file
		 */
		if (!require('fs').existsSync(path)) {
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
<style> </style>
