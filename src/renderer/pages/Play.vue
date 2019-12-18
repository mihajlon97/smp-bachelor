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
				<button v-if="!presentation.loaded" @click="loadPresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #318b34; color: green;">▶</button>
				<button @click="deletePresentation(presentation)" class="button button-play round-btn" style="border: 2px solid #df706d; color: red;">✖</button>
				<!--  position: absolute; z-index: -200; -->
				<div style="width: 100%!important; max-width: 100%!important; position: absolute; z-index: -200;">
					<swiper :id="'presentation-' + presentation.id" ref="mySwiper" :options="swiperOption" style="text-align: center; background-color: #000000;">
						<div v-show="loadingStarted && false" style="width: 100vw; height: 100vh; position: absolute; z-index: 500; top:0; background-color: #000000;">
							<div class="loader" style="top: 40%;"></div>
						</div>
						<swiper-slide v-for="(slide, i) in slides" :key="'slide-' + i" style="height:100vh; text-align: center; display: inline-block;">

							<Editor :path1="slide['image1'].file.path"
									:path2="slide['image2'].file.path"

							        :meta1="slide['image1'].meta"
							        :meta2="slide['image2'].meta"
							        :disabled="true"

							        @updateDone="updateDone"
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
		    imgPlay: '',
			something1: {},
			something2: {},
			croppas: {},
		    loadingPercentage: 0,
			loading: [],
			slides: [],
			played: false,
		    loadingStarted: false,
		    loadingInterval: null,
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
      ...mapGetters(['presentations']),
      isLoading() {
        return this.loadingPercentage > 0 && this.loadingPercentage < 100
      }
    },
	methods: {
	  ...mapActions(['fetchPresentations']),
	  updateSwiper() {
		  if (this.$refs.mySwiper.swiper)
			  this.$refs.mySwiper.swiper.update();
		  this.$forceUpdate();
	  },
	  loadPresentation(data) {
	    let presentation = this.presentations.filter(elem => elem.id === data.id)[0];
	    if (!presentation) return console.error('NO PRESENTATION WITH THIS ID');
	    // this.loadingStarted = true;
	    this.slides = presentation.slides;
	    this.openFullScreen(data);
	    this.loadingInterval = setInterval(() => {
	    	if(this.loadingPercentage >= 100) {
		        this.loadingStarted = false
		        clearInterval(this.loadingInterval)
		    }
	    }, 1000);
	  },
	  deletePresentation(presentation) {
	      this.$swal({
	        title: "Are you sure?",
	        text:"Presentation will be permanently removed.",
	        icon: "warning",
	        showCancelButton: true,
	        cancelButtonText: 'Cancel',
	      }).then((value) => {
	        if (value) {
	          const fs = require('fs');
	          const storageDir = 'C:\\Users\\miki9\\Desktop\\Notebook\\Bachelor Informatik\\Semester 6\\Bachelor\\sip-bachelor\\src\\renderer\\storage\\';
	          let rawStorage = fs.readFileSync(storageDir + 'storage.json');
	          let presentations = JSON.parse(rawStorage);
	          for(let i = presentations.length - 1; i > -1; i--){
	            if (presentations[i].id === presentation.id){
	              presentations.splice(i, 1);
	            }
	          }
	          fs.writeFileSync(storageDir + 'storage.json', JSON.stringify(presentations));
	          this.fetchPresentations();
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
	    console.log(this.croppas);
	  },
	  updateDone() {
	    this.loading.push(1);
		console.log('Loaded: ' + this.loading.length, 'Total:' + this.slides.length * 2);
		this.loadingPercentage = (this.loading.length / (this.slides.length * 2)) * 100;
		console.log('Percentage: ' + this.loadingPercentage);
	  }
	},
    mounted(){
		this.initialize()
    }
}
</script>

<style>
</style>
