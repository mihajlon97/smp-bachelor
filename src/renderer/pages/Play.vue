<template>
	<div class="play page" :style="((!$route.query.autoplay) ? 'overflow-y: scroll!important;' : '')">

		<!-- Info Div -->
		<Info />

		<!-- Play Centered Div -->
		<div style="width: 100%; margin: 0 auto; text-align: center;">
			<div v-if="!$route.query.autoplay" style="margin-top: 30px;">
				<router-link to="/" style="margin-top: 30px;">
					<!-- Base64 from ../assets/256x256.png -->
					<img src="data:image/png;base64,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"/>
				</router-link>
				<br>
				<button @click="createPresentation" class="button button-play black" style="margin: 20px 0 20px 0; border-radius: 15px; font-weight: bold">
					Create new presentation
				</button>
			</div>

			<!-- Presentation List -->
			<div v-for="(presentation, presentation_id) in presentations" :key="presentation_id" :id="'presentation' + presentation.id" :style="(!$route.query.autoplay) ? 'margin-bottom: 15px' : ''" v-show="!$route.query.autoplay || $route.query.autoplay === presentation.id">

				<!-- Presentation name and Controls (Play, Edit and Delete) -->
				<span v-if="!$route.query.autoplay">
					<span style="font-size: 25px; font-weight: bold;"> {{presentation.name}} </span>
					<button @click="playPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;"> ▶</button>
					<button @click="editPresentation(presentation)" class="button button-play round-btn" style="color: black;">✎</button>
					<button @click="deletePresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #df706d; color: red;">✖</button>
				</span>

				<!-- Played presentation rendered to the DOM, but shown only while playing -->
				<div v-if="$route.query.autoplay === presentation.id || true" :style="'width: 100%; height: 100vh;' + ((!$route.query.autoplay) ? 'position: absolute; z-index: -200;' : '')">
					<swiper :id="'presentation-' + presentation.id" :ref="'mySwiper' + presentation_id" class="mySwiper" :options="swiperOption" style="text-align: center; background-color: #000000;">
						<swiper-slide v-for="(slide, i) in presentation.slides" :key="'slide-' + i" :id="'id-' + presentation_id + '-' + i" :style="'width: 80vw; height: 100vh;'">
							<!-- Media Holder in every slide displaying all medias in that slide -->
							<MediaHolder
							        :id="'id-' + presentation_id + '-' + i"
									:slide_prop="slide"
						            :playing="true"
							        :prop_rows="slide[0]"
							        :prop_columns="slide[1]"
							/>
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';
	import 'swiper/dist/css/swiper.css'
	import {swiper, swiperSlide} from 'vue-awesome-swiper'
	import MediaHolder from "../components/MediaHolder";
	import Info from '../components/Info';
	import AlertMixin from '../mixins/alert.mixin';

	export default {
	name: "PlayNew",
	mixins: [AlertMixin],
	components: {
	    Info,
		MediaHolder,
		swiper,
		swiperSlide,
	},
    data () {
		return {
		    displays: [],

		    // Default Presentation Slider Props
			swiperOption: {
				speed: 500,
				slidesPerView: 1,
				spaceBetween: 0,
				effect: 'fade',
				autoHeight: true,
				pagination: {
					el: '.swiper-pagination'
				},
				keyboard: {
					enabled: true,
				}
			},
		}
    },
    computed: {
      ...mapGetters(['presentations'])
    },
	methods: {
	  ...mapActions(['fetchPresentations']),
	  async createPresentation() {
		  const action = await this.newPresentationAlert();

		  switch (action) {
		    case 'create' : {
		        this.namePresentationAlert()
			    .then((name) => {
				    if (name && name.length > 0) {
				        return this.$router.push('/edit?presentation_name=' + name)
				    }
			    });
			    break;
		    }
			case 'import' : {
			  this.importPresentation();
			}
		  }
	  },
	/**
	 * Play chosen presentation in fullscreen mode
	 * @param presentation
	 */
	  async playPresentation(presentation) {

			this.displays = require('electron').remote.screen.getAllDisplays();

			let chosenScreen = 'main';

			let external = {};
			for (let i in this.displays) {
				if (this.displays[i].bounds.x !== 0 || this.displays[i].bounds.y !== 0) {
					const id = Object.keys(external).length + 1;
				    external['external' + id] = {
				    	value: this.displays[i].id,
				        text: 'External Screen ' + id
					}
				}
			}

			if (this.displays.length > 1) {
				chosenScreen = await this.selectTheScreenAlert(external)
			}

			let externalDisplay = null;
			for (let i in this.displays) {
				if ((this.displays[i] && this.displays[i].bounds.x !== 0 || this.displays[i].bounds.y !== 0) && this.displays[i].id === chosenScreen) {
					externalDisplay = this.displays[i];
					break;
				}
			}

			const { BrowserWindow } = require('electron').remote;
			const modalPath = process.env.NODE_ENV === 'development'
				? 'http://localhost:9080/#/play?autoplay=' + presentation.id
				: `file://${__dirname}/index.html#play?autoplay=` + presentation.id;

			let newWindow = new BrowserWindow({
				x: (chosenScreen !== 'main') ? externalDisplay.bounds.x + 50 : 0,
				y: (chosenScreen !== 'main') ? externalDisplay.bounds.y + 50 : 0,
				frame: false,
			    fullscreen: true,
				webPreferences: {
					webSecurity: false
				}
			});


			newWindow.on('close', function () { return false; });
			newWindow.webContents.on("devtools-opened", () => {
			    newWindow.webContents.closeDevTools();
			});
			newWindow.maximize();
			newWindow.loadURL(modalPath);
	  },
	  importPresentation() {
	        const { dialog } = require('electron').remote;
	        dialog.showOpenDialog({
			  properties: ['openFile'],
			  filters: [
				  { name: 'Excel', extensions: ['xlsx', 'csv'] },
			  ]
		    }, (files) => {
	          if (files) {
	            const XLSX = require('xlsx');
	            const workbook = XLSX.readFile(require('path').join(files[0]));
				const sheet_name_list = workbook.SheetNames;
				const sheet = workbook.Sheets[sheet_name_list[0]];
				const slides = XLSX.utils.sheet_to_json(sheet);

				this.namePresentationAlert()
				  .then((name) => {
					  if (name && name.length > 0) {
						  const XLSX = require('xlsx');
						  const path = require('path');
						  const storageDir = path.join(require('electron').remote.app.getPath('userData'), '\\presentations.xlsx');
						  const workbook = XLSX.readFile(path.join(storageDir));
						  const sheet_name_list = workbook.SheetNames;
						  const sheet = workbook.Sheets[sheet_name_list[0]];
						  const presentations = XLSX.utils.sheet_to_json(sheet);
					      console.log('PRESENTATIONS', presentations);

					      const presentation = {
							  id: this.uuidv4(),
							  name: name,
							  file: files[0]
						  };

						  presentations.push(presentation);

						  workbook.Sheets[sheet_name_list[0]] = XLSX.utils.json_to_sheet(presentations);
						  XLSX.writeFile(workbook, storageDir);
					      this.fetchPresentations();
					  }
				  });
	          }
			});
	  },
	  editPresentation(presentation) {
	    this.fetchPresentations()
	  	this.$router.push('/edit?edit=' + presentation.id);
	  },
	  deletePresentation(presentation) {
	      this.deletePresentationAlert()
	        .then((value) => {
		        if (value) {
	              try {
		              const XLSX = require('xlsx');
		              const storageDir = require('path').join(require('electron').remote.app.getPath('userData'), '\\presentations.xlsx');
		              const workbook = XLSX.readFile(require('path').join(storageDir));
		              const sheet_name_list = workbook.SheetNames;
		              const sheet = workbook.Sheets[sheet_name_list[0]];
		              const presentations = XLSX.utils.sheet_to_json(sheet);
		              for(let i = presentations.length - 1; i > -1; i--){
			              if (presentations[i].id === presentation.id){
				              require('fs').unlinkSync(presentations[i].file)
				              presentations.splice(i, 1);
			              }
		              }
		              workbook.Sheets[sheet_name_list[0]] = XLSX.utils.json_to_sheet(presentations);
		              XLSX.writeFile(workbook, storageDir);

		              // Re-fetch presentations
		              this.fetchPresentations();
		          } catch (e) {
		              this.presentationNotRemovedAlert()
		          }
		        }
	        });
	  },
	},
    mounted(){
	    setTimeout(() => {
			// Fullscreen exit - Slide to beginning of each presentation
	        const exitHandler = () => {
			    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
				    for (let i = 0; i < sliders.length; i++) {
					    if (this.$refs['mySwiper' + i][0].swiper) {
						    this.$refs['mySwiper' + i][0].swiper.slideTo(0, 500);
					    }
				    }
			    }
		    };

	        if (this.$route.query.autoplay) {
		        document.onkeydown = (evt) => {
			        evt = evt || window.event;
			        let isEscape = false;
			        if ("key" in evt) {
				        isEscape = (evt.key === "Escape" || evt.key === "Esc");
			        } else {
				        isEscape = (evt.keyCode === 27);
			        }
			        if (isEscape) {
			          require('electron').remote.getCurrentWindow().close();
			        }
		        };
	        }

		    if (document.addEventListener) {
			    document.addEventListener('fullscreenchange', exitHandler, false);
			    document.addEventListener('mozfullscreenchange', exitHandler, false);
			    document.addEventListener('MSFullscreenChange', exitHandler, false);
			    document.addEventListener('webkitfullscreenchange', exitHandler, false);
		    }


	        // Click moving through presentation events
	      	let sliders = document.getElementsByClassName('mySwiper');
	      	for (let i = 0; i < sliders.length; i++) {
			      sliders[i].addEventListener('contextmenu', () => {
				      if (this.$refs['mySwiper' + i][0].swiper) {
					      this.$refs['mySwiper' + i][0].swiper.slidePrev(500, () => {
						      console.log('SLIDE PREVIOUS');
					      });
				      }
			      });
			      sliders[i].addEventListener('click', () => {
			          if (this.$refs['mySwiper' + i][0].swiper) {
				          this.$refs['mySwiper' + i][0].swiper.slideNext(500, () => {
					          console.log('SLIDE NEXT');
				          });
			          }
			      })
	        }

	    }, 2000);
    }
}
</script>

<style>
	.hide {
		display: none;
	}
</style>
