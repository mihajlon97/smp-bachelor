<template>
	<div class="play page" style="overflow-y: scroll!important;">
		<div style="width: 100%; margin: 0 auto; text-align: center;">
			<router-link to="/">
				<img src="../assets/256x256.png" alt="Smart Image Presenter">
			</router-link>
			<br>
			<router-link to="create" tag="button" class="button button-play black" style="margin: 20px 0 20px 0; border-radius: 15px; font-weight: bold">
				Create new presentation
			</router-link>
			<div v-for="(presentation, i) in presentations" :key="i" :id="'presentation' + presentation.id" style="margin-bottom: 15px;">
				<span style="font-size: 25px; font-weight: bold;"> {{presentation.name}} </span>
				<button v-if="!presentation.loaded" @click="loadPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;">Load</button>
				<button v-else @click="playPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;">▶</button>
				<button @click="deletePresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #df706d; color: red;">✖</button>
				<!--  position: absolute; z-index: -200; -->
				<div style="width: 100%!important; max-width: 100%!important; position: absolute; z-index: -200;">
					<swiper :id="'presentation-' + presentation.id" ref="mySwiper" :options="swiperOption" style="text-align: center; background-color: #000000;">
						<div :class="{'hide': !loadingStarted}" style="width: 100vw; height: 100vh; position: absolute; z-index: 500; top:0; background-color: #000000;">
							<div class="loader" style="top: 40%;"></div>
						</div>
						<swiper-slide v-for="(slide, i) in presentation.slides" :key="'slide-' + i" style="height:100vh; text-align: center; display: inline-block;">
							<Editor v-if="init[presentation.id]"
									:path1="slide['image1'].path"
									:path2="slide['image2'].path"

							        :meta1="slide['image1'].meta"
							        :meta2="slide['image2'].meta"
							        :disabled="true"
							/>
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Editor from '../components/Editor';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	name: "Play",
	components: {
	    Loading,
		swiper,
		swiperSlide,
	    Editor
	},
    data () {
		return {
		    init: {},
		    imgPlay: '',
			something1: {},
			something2: {},
			croppas: {},
			loading: [],
			slides: [],
			played: false,
		    loadingStarted: false,
		    loaded: false,
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
	  playPresentation(data) {
	    this.openFullScreen(data);
	  },
	  loadPresentation(data) {
	    let presentation = this.presentations.filter(elem => elem.id === data.id)[0];
	    if (!presentation) return console.error('NO PRESENTATION WITH THIS ID');

	    this.presentations.forEach(presentation => {
	    	if (presentation.id === data.id) {
	    		presentation.loaded = true;
		    }
	    });

	    this.loadingStarted = true;
	    this.init[data.id] = true;
	    setTimeout(() => {
	      this.loadingStarted = false
	    }, 2000);
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
	              const excel = false;
	              if(excel) {
		              const storageDir = require('path').join(__dirname, '\\..\\storage\\storage.json');
		              const fs = require('fs');
		              let rawStorage = fs.readFileSync(storageDir);
		              let presentations = JSON.parse(rawStorage);
		              for(let i = presentations.length - 1; i > -1; i--){
			              if (presentations[i].id === presentation.id){
				              presentations.splice(i, 1);
			              }
		              }
		              fs.writeFileSync(storageDir, JSON.stringify(presentations));
	              } else {
		              const XLSX = require('xlsx');
		              const storageDir = require('path').join(__dirname, '\\..\\storage\\presentations.xlsx');
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
		              const sheet_updated = XLSX.utils.json_to_sheet(presentations);
		              workbook.Sheets[sheet_name_list[0]] = sheet_updated;
		              XLSX.writeFile(workbook, storageDir);
	              }

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
	  openFullScreen(presentation) {
		let elem = document.getElementById('presentation-' + presentation.id);
		if (elem) {
		  if (elem.requestFullscreen) {
			  elem.requestFullscreen();
		  } else if (elem.mozRequestFullScreen) { /* Firefox */
			  elem.mozRequestFullScreen();
		  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			  elem.webkitRequestFullscreen();
		  } else if (elem.msRequestFullscreen) { /* IE/Edge */
			  elem.msRequestFullscreen();
		  }
		}
	  },
	  initialize() {
	  	let presentations = Array.concat(this.presentations, []);
	    presentations.forEach(presentation => {
		  this.croppas[presentation.id] = presentation.slides;
		});
	  }
	},
    mounted(){
		this.initialize();
	    setTimeout(() => {
		    this.loadingStarted = false
	    }, 1000);
    }
}
</script>

<style>
	.hide {
		display: none;
	}
</style>
