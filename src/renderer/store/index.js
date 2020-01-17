import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		error: {},
		loading: false,
		presentations: [],
		activeSlide: 0,
		storageFile: '\\..\\storage\\presentations.xlsx'
	},
	getters: {
		route: state => state.route,
		error: state => state.error,
		loading: state => state.loading,
		presentations: state => state.presentations
	},
	actions: {
		async fetchPresentations({state, commit}, excel = true) {
			state.activeSlide = 0;
			try {
				const fs = require('fs');
				let presentations = [];

				// Excel storage
				if (excel) {
					const XLSX = require('xlsx');
					const workbook = XLSX.readFile(require('path').join(__dirname, state.storageFile));
					const sheet_name_list = workbook.SheetNames;
					const _presentations = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

					if (_presentations.length > 0){
						_presentations.forEach(presentation => {

							const workbook = XLSX.readFile(require('path').join(presentation.file));
							const sheet_name_list = workbook.SheetNames;
							const sheet = workbook.Sheets[sheet_name_list[0]];
							const slides = XLSX.utils.sheet_to_json(sheet);

							// General presentation information
							presentations.push({
								"id": presentation.id,
								"name": presentation.name,
								"slides": []
							});

							// Slides
							slides.forEach(slide => {
								presentations[presentations.length - 1].slides.push(
									{
										"image1":{
											"path": slide.path_1,
											"meta":{
												"startX": slide.startX_1,
												"startY": slide.startY_1,
												"scale": slide.scale_1,
												"orientation": 1
											}
										},
										"image2":{
											"path": slide.path_2,
											"meta":{
												"startX": slide.startX_2,
												"startY": slide.startY_2,
												"scale": slide.scale_2,
												"orientation": 1
											}
										}
									});
							});
						});
					}
					// Json storage
				} else {
					let rawStorage = fs.readFileSync(require('path').join(__dirname, '\\..\\storage\\storage.json'));
					presentations = JSON.parse(rawStorage);
				}
				commit('setPresentations', presentations)
			} catch (e) {
				console.log(e);
				this._vm.$swal({
					title: "Error",
					text: "Presentations not loaded due to error.",
					icon: "warning",
				});
			}
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
