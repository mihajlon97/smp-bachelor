<template>
	<div>
		<router-link to="create" style="color: red;"> PLAY </router-link>
		{{presentations}}
		<div v-for="presentation in presentations" :key="presentation.id" :id="'presentation' + presentation.id">
			{{presentation.name}}
			<button @click="openFullscreen(presentation.id)"> Play </button>
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
			swiperOption: {
				speed: 2000,
				slidesPerView: 1,
				spaceBetween: 0,
				effect: 'fade',
				loop: true,
				autoHeight: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false
				},
				pagination: {
					el: '.swiper-pagination'
				},
				on: {
					slideChange: this.updateSwiper,
					transitionStart() {
						let element = document.getElementsByClassName('swiper-slide swiper-slide-active')[0].childNodes[0];
						if (element.tagName === "VIDEO") {
							element.play()
						}
					}
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

	  openFullscreen() {
		  let elem = document.getElementById('whitediv');
		  if (elem.requestFullscreen) {
			  elem.requestFullscreen();
		  } else if (elem.mozRequestFullScreen) { /* Firefox */
			  elem.mozRequestFullScreen();
		  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			  elem.webkitRequestFullscreen();
		  } else if (elem.msRequestFullscreen) { /* IE/Edge */
			  elem.msRequestFullscreen();
		  }
	  },
	}
}
</script>

<style scoped>

</style>
