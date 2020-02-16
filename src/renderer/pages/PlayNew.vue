<template>
	<div class="play page" :style="((!$route.query.autoplay) ? 'overflow-y: scroll!important;' : '')">
		<div style="width: 100%; margin: 0 auto; text-align: center;">
			<div v-if="!$route.query.autoplay" style="margin-top: 30px;">
				<router-link to="/" style="margin-top: 30px;">
					<!-- Base64 from ../assets/256x256.png -->
					<img src="data:image/png;base64,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" alt="Smart Image Presenter">
				</router-link>
				<br>
				<button @click="createPresentation" class="button button-play black" style="margin: 20px 0 20px 0; border-radius: 15px; font-weight: bold">
					Create new presentation
				</button>
			</div>

			<div v-for="(presentation, presentation_id) in presentations" :key="presentation_id" :id="'presentation' + presentation.id" :style="(!$route.query.autoplay) ? 'margin-bottom: 15px' : ''" v-show="!$route.query.autoplay || $route.query.autoplay === presentation.id">
				<span v-if="!$route.query.autoplay">
					<span style="font-size: 25px; font-weight: bold;"> {{presentation.name}} </span>
					<button @click="playPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;"> ▶</button>
					<button @click="editPresentation(presentation)" class="button button-play round-btn" style="color: black;">✎</button>
					<button @click="deletePresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #df706d; color: red;">✖</button>
					<!--  position: absolute; z-index: -200; -->
				</span>

				<div :style="'width: 100%; height: 100vh;' + ((!$route.query.autoplay) ? 'position: absolute; z-index: -200;' : '')">
					<swiper :id="'presentation-' + presentation.id" :ref="'mySwiper' + presentation_id" class="mySwiper" :options="swiperOption" style="text-align: center; background-color: #000000;">
						<swiper-slide v-for="(slide, i) in presentation.slides" :key="'slide-' + i" :id="'id-' + presentation_id + '-' + i" :style="'width: 80vw; height: 100%;'">
							<MediaHolder
							        :id="'id-' + presentation_id + '-' + i"
									:media_prop="slide"
						            :playing="true"
							        :media_count="slide.length"
							/>
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters, mapState} from 'vuex';
	import 'swiper/dist/css/swiper.css'
	import {swiper, swiperSlide} from 'vue-awesome-swiper'
	import Editor from '../components/Editor';
	import MediaHolder from "../components/MediaHolder";

	export default {
	name: "PlayNew",
	components: {
		MediaHolder,
		swiper,
		swiperSlide,
	    Editor
	},
    data () {
		return {
		    displays: [],
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
      ...mapState(['storageFile']),
      ...mapGetters(['presentations'])
    },
	methods: {
	  ...mapActions(['fetchPresentations']),
	  async createPresentation() {
		  const action = await this.$swal({
			  title: "New Presentation",
			  text: "Create a new presentation manually or import existing one.",
			  // icon: "info",
			  buttons: {
				  cancel: "Cancel",
				  import:{
					  text: "Import existing",
					  value: "import",
				  },
				  create: {
					  text: "Create new",
					  value: "create"
				  }
			  },
		  });
		  console.log(action);
		  switch (action) {
		    case 'create' : {
			    this.$swal({
				    title: "Name your presentation",
				    content: "input",
				    buttons: {
				        cancel: "Cancel",
				        save: {
				    		value: 'save',
				    		text: 'Save',
					    },
				    },
			    }).then((name) => {
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
			console.log(this.displays);
			let chosenScreen;

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
				chosenScreen = await this.$swal({
					title: "Select the screen",
					text: "Pick a screen on which the presentation should be played.",
					icon: "info",
					buttons: {
					    ...external,
						main: {
							text: "Main screen",
							value: "main"
						}
					},
				});
			}

			let externalDisplay = null;
			for (let i in this.displays) {
				if ((this.displays[i].bounds.x !== 0 || this.displays[i].bounds.y !== 0) && this.displays[i].id === chosenScreen) {
					externalDisplay = this.displays[i];
					break;
				}
			}

			const { BrowserWindow } = require('electron').remote;
			const modalPath = process.env.NODE_ENV === 'development'
				? 'http://localhost:9080/#/edit?play=' + presentation.id
				: `file://${__dirname}/index.html#edit?play=` + presentation.id;

			let win = new BrowserWindow({
				x: (chosenScreen !== 'main') ? externalDisplay.bounds.x + 50 : 0,
				y: (chosenScreen !== 'main') ? externalDisplay.bounds.y + 50 : 0,
				frame: false,
			    fullscreen: true,
				webPreferences: {
					webSecurity: false
				}
			});


			win.on('close', function () { console.log('presentation closed') });
			win.webContents.on("devtools-opened", () => {
			   win.webContents.closeDevTools();
			});
			win.maximize();
			win.loadURL(modalPath);
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
	            console.log(files);
	            const XLSX = require('xlsx');
	            const workbook = XLSX.readFile(require('path').join(files[0]));
				const sheet_name_list = workbook.SheetNames;
				const sheet = workbook.Sheets[sheet_name_list[0]];
				const slides = XLSX.utils.sheet_to_json(sheet);
				console.log(slides);

				this.$swal("Name your presentation", {
				  content: "input",
				  buttons: ["Save"],
				}).then((name) => {
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
					  console.log('PRESENTATION', presentation);
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
	  	this.$router.push('/edit?edit=' + presentation.id);
	  },
	  deletePresentation(presentation) {
	      this.$swal({
	        title: "Are you sure?",
	        text:"Presentation will be permanently removed.",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
	      }).then((value) => {
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
	              this.$swal({
		              title: "Error",
		              text: "Presentation was not removed due to error.",
		              icon: "warning",
	              });
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

		    console.log('SLIDERS', sliders);
	      	for (let i = 0; i < sliders.length; i++) {
	      		console.log('EEE', this.$refs)
			      sliders[i].addEventListener('contextmenu', () => {
			      	console.log(i, this.$refs['mySwiper' + i][0])
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

	    }, 1000);
    }
}
</script>

<style>
	.hide {
		display: none;
	}
</style>
