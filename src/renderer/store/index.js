import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import modules from './modules'
Vue.use(Vuex);

export default new Vuex.Store({
	modules,
	plugins: [
		createPersistedState(),
		createSharedMutations()
	],
	strict: process.env.NODE_ENV !== 'production',
	state: {
		error: {},
		loading: false,
		presentations: []
	},
	getters: {
		route: state => state.route,
		error: state => state.error,
		loading: state => state.loading,
		presentations: state => state.presentations
	},
	actions: {
		async fetchPresentations({state, commit}) {
			const testFolder = 'C:/presentations/';
			const fs = require('fs');

			fs.readdirSync(testFolder).forEach(file => {
				console.log("File: " + file);
				const XLSX = require('xlsx');
				const workbook = XLSX.readFile(testFolder + file);
				const sheet_name_list = workbook.SheetNames;
				console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
			});
		},
	},
	mutations: {
		setLoading (state, loading) {
			state.loading = loading
		},
		setPresentations(state, data) {
			state.presentations = data;
		}
	}
});
