import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		presentations: [],
		activeSlide: 0,
	},
	getters: {
		presentations: state => state.presentations,
		activeSlide: state => state.activeSlide
	},
	actions: {
		async fetchPresentations({state, commit}) {
			state.activeSlide = 0;
			try {
					let presentations = [];
					const XLSX = require('xlsx');
					const workbook = XLSX.readFile(require('path').join(require('electron').remote.app.getPath('userData'), '\\presentations.xlsx'));
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
								let allSlides = [slide.rows, slide.columns];
								Object.keys(slide).forEach(key => {
									if (key !== 'rows' && key !== 'columns') {
										let keyValue = key.split('_');
										const index = (parseInt(keyValue[1]) - 1) + 2;
										if (!allSlides[index]) allSlides[index] = {};
										allSlides[index][keyValue[0]] = slide[key];
									}
								});
								presentations[presentations.length - 1].slides.push(allSlides);
							});
						});
					}
					commit('setPresentations', presentations);
					return true;
			} catch (e) {
				this._vm.$swal({
					title: "Error",
					text: "Presentations not loaded due to error.",
					icon: "warning",
				});
				return false;
			}
		},
	},
	mutations: {
		setPresentations(state, data) {
			console.log(data)
			state.presentations = data;
		}
	}
});
