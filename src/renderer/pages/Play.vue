<template>
	<div>
		<router-link to="create" style="color: red;"> CREATE </router-link>
		<div v-for="presentation in presentations" :key="presentation.id" :id="'presentation' + presentation.id">
			{{presentation.name}}
			<button v-if="loaded" @click="openFullscreen"> Play </button>
			<button v-if="!loaded" @click="loadPresentation(presentation.id)"> Load </button>
		</div>

		<div v-show="loaded">
			<swiper id="presentation" v-if="slides.length > 0 && loaded" ref="mySwiper" :options="swiperOption">
				<swiper-slide v-for="(slide, i) in slides" :key="'slide-' + i">
					<img style="margin: 0!important; max-width: 50%; float: left;" :src="get_blob(slide['image-1'].path)">
					<img style="margin: 0!important; max-width: 50%; float: right;" :src="get_blob(slide['image-2'].path)">
				</swiper-slide>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
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
				effect: '',
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
	  updateSwiper() {
		  if (this.$refs.mySwiper.swiper)
			  this.$refs.mySwiper.swiper.update();
		  this.$forceUpdate();
	  },
	  loadPresentation(id) {
		  const presentation = this.presentations.filter(elem => elem.id === id)[0];
		  if (!presentation) return console.error('NO PRESENTATION WITH THIS ID');
		  this.slides = presentation.slides;
		  this.loaded = true;
	  },
	  openFullscreen() {
	  	this.played = true;
		let elem = document.getElementById('presentation');
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

		if (document.addEventListener) {
		  document.addEventListener('fullscreenchange', () => exitHandler(this), false);
		  document.addEventListener('mozfullscreenchange', () => exitHandler(this), false);
		  document.addEventListener('MSFullscreenChange', () => exitHandler(this), false);
		  document.addEventListener('webkitfullscreenchange', () => exitHandler(this), false);
		}

		function exitHandler(s) {
		  if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
			  s.played = false
		  }
		}

			  /*
		const { dialog } = require('electron').remote;
		dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }, function (files) {
		    if (files !== undefined) {
		        console.log(files);
		    }
		});
		*/
	  }
	}
}
</script>

<style scoped>

</style>
