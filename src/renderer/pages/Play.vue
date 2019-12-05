<template>
	<div class="page">
		<div style="width: 50%; margin: 0 auto; text-align: center;">
			<router-link to="/">
				<img src="../assets/256x256.png" alt="Smart Image Presenter">
			</router-link>
			<br>
			<router-link to="create" tag="button" class="button button-play black" style="margin: 20px 0 20px 0; border-radius: 15px; font-weight: bold">
				Create new presentation
			</router-link>
			<div v-for="(presentation, i) in presentations" :key="i" :id="'presentation' + presentation.id" style="margin-bottom: 15px;">
				<span style="font-size: 25px; font-weight: bold;">{{presentation.name}}</span>
				<button v-if="!presentation.loaded" @click="loadPresentation(presentation)"
				        class="button button-play round-btn" style="border: 2px solid #318b34; color: green;">
					▶
				</button>
				<button @click="deletePresentation(presentation)"
				        class="button button-play round-btn" style="border: 2px solid #df706d; color: red;">
					✖
				</button>

				<div style="position: absolute; z-index: -200; width: 100%!important; max-width: 100%!important;">
					<swiper :id="'presentation-' + presentation.id" v-if="slides.length > 0" ref="mySwiper" :options="swiperOption">
						<swiper-slide v-for="(slide, i) in slides" :key="'slide-' + i" style="width: 100%!important;">
							<img v-if="slide['image1']"
							     style="display:block; margin: auto; float: left; object-fit: contain!important;"
							     :src="get_blob(slide['image1'].path)"
							     :class="{'is-half': slide['image2'], 'is-full': !slide['image2']}"
							>

							<img v-if="slide['image2']"
							     style="display:block; margin: auto; float: right; object-fit: contain!important;"
							     :src="get_blob(slide['image2'].path)"
							     :class="{'is-half': slide['image1'], 'is-full': !slide['image1']}"
							>
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
export default {
	name: "Play",
	components: {
		swiper,
		swiperSlide,
	},
    data () {
		return {
		    imgPlay: '',
			slides: [],
			played: false,
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
	  updateSwiper() {
		  if (this.$refs.mySwiper.swiper)
			  this.$refs.mySwiper.swiper.update();
		  this.$forceUpdate();
	  },
	  loadPresentation(data) {
	    let presentation = this.presentations.filter(elem => elem.id === data.id)[0];
	    if (!presentation) return console.error('NO PRESENTATION WITH THIS ID');
	    this.slides = presentation.slides;
	    setTimeout(() => {
	      this.openFullScreen(data);
	    }, 1000);
	  },
	  deletePresentation(presentation) {
	      this.$swal({
	        title: "Are you sure?",
	        text:"Presentation will be permanently removed.",
	        icon: "warning",
	        showCancelButton: true,
	      }).then((value) => {
	        if (value) {
	          const fs = require('fs');
	          const storageDir = 'C:\\Users\\miki9\\Desktop\\Notebook\\Bachelor Informatik\\Semester 6\\Bachelor\\sip-bachelor\\src\\renderer\\storage\\';
	          let rawStorage = fs.readFileSync(storageDir + 'storage.json');
	          let presentations = JSON.parse(rawStorage);

	          for(let i = presentations.length - 1; i--;){
	            if (presentations[i].id === presentation.id)
	              presentations.splice(i, 1);
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
	  }
	}
}
</script>

<style>
</style>
