import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex);

export default new Vuex.Store({
	modules,
	// plugins: [
	// 	createPersistedState(),
	// 	createSharedMutations()
	// ],
	strict: false,
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
		async fetchPresentations({state, commit}, excel = false) {
			const fs = require('fs');
			let presentations = [];

			// Excel storage
			if (excel) {
				const storageDir = 'C:/presentations/';
				fs.readdirSync(storageDir).forEach(file => {
					const XLSX = require('xlsx');
					const workbook = XLSX.readFile(storageDir + file);
					const sheet_name_list = workbook.SheetNames;
					const parsed_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

					if (parsed_sheet.length > 0 ){
						parsed_sheet[0].config = JSON.parse(parsed_sheet[0].config);
						presentations.push(parsed_sheet[0])
					}
				});
				// Json storage
			} else {
				let rawStorage = fs.readFileSync(__dirname + '\\..\\storage\\storage.json');
				presentations = JSON.parse(rawStorage);
			}
			commit('setPresentations', presentations)
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
