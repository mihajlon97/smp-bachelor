<template>
	<div class="play page" style="overflow-y: scroll!important;">
		<div style="width: 100%; margin: 0 auto; text-align: center;">
			<router-link to="/">
				<img src="../assets/256x256.png" alt="Smart Image Presenter">
			</router-link>
			<br>
			<router-link to="edit" tag="button" class="button button-play black" style="margin: 20px 0 20px 0; border-radius: 15px; font-weight: bold">
				Create new presentation
			</router-link>
			<div v-for="(presentation, pr_i) in presentations" :key="pr_i" :id="'presentation' + presentation.id" style="margin-bottom: 15px;">
				<span style="font-size: 25px; font-weight: bold;"> {{presentation.name}} </span>
				<button v-if="!presentation.loaded && false " @click="loadPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;">Load</button>
				<button v-else @click="playPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;">
					<span v-if="!loadingStarted || true">▶</span>
					<span v-else>Loading...</span>
				</button>
				<button @click="editPresentation(presentation)" class="button button-play round-btn" style="color: black;">✎</button>
				<button @click="deletePresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #df706d; color: red;">✖</button>
				<!--  position: absolute; z-index: -200; -->
				<div style="width: 100%!important; max-width: 100%!important; position: absolute; z-index: -200;">
					<swiper :id="'presentation-' + presentation.id" :ref="'mySwiper' + (pr_i + 1)" class="mySwiper" :options="swiperOption" style="text-align: center; background-color: #000000;">
						<div :class="{'hide': !loadingStarted || true}" style="width: 100vw; height: 100vh; position: absolute; z-index: 500; top:0; background-color: #000000;">
							<div class="loader" style="top: 40%;"></div>
						</div>
						<swiper-slide v-for="(slide, i) in presentation.slides" :key="'slide-' + i" style="height:100vh; text-align: center; display: inline-block;" :id="'id-' + pr_i + '-' + i" >
							<MediaHolder v-if="init[presentation.id] || true"
							        :id="'id-' + pr_i + '-' + i"
									:image1_prop="slide['image1'].path"
									:image2_prop="slide['image2'].path"

									:x1_prop="slide['image1'].startX"
								    :x2_prop="slide['image2'].startX"

								    :y1_prop="slide['image1'].startY"
							        :y2_prop="slide['image2'].startY"

						            :scale1_prop="slide['image1'].scale"
						            :scale2_prop="slide['image2'].scale"

						            :rotate1_prop="slide['image1'].orientation"
					                :rotate2_prop="slide['image2'].orientation"

						            :playing="true"
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
      ...mapState(['storageFile']),
      ...mapGetters(['presentations'])
    },
	methods: {
	  ...mapActions(['fetchPresentations']),
	  playPresentation(presentation) {
	      if(this.loadingStarted === true) return;
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
	    this.loadingStarted = false
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
	  initialize() {
	  	let presentations = Array.concat(this.presentations, []);
	    presentations.forEach(presentation => {
		  this.croppas[presentation.id] = presentation.slides;
		});

	    console.log(this.presentations)
	  }
	},
    mounted(){
		this.initialize();
	    setTimeout(() => {
		    this.loadingStarted = false

	      //

	      	let sliders = document.getElementsByClassName('mySwiper');

	      	for (let i = 0; i < sliders.length; i++) {
			      sliders[i].addEventListener('contextmenu', () => {
				      if (this.$refs['mySwiper1'][0].swiper) {
					      this.$refs['mySwiper1'][0].swiper.slidePrev(500, () => {
						      console.log('SLIDE PREVIOUS');
					      });
				      }
			      });
			      sliders[i].addEventListener('click', () => {
			          if (this.$refs['mySwiper1'][0].swiper) {
				          this.$refs['mySwiper1'][0].swiper.slideNext(500, () => {
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
