import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
	components: {
		swiper,
		swiperSlide
	},
	data () {
		return {
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
	mounted() {
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
						this.$refs['mySwiper' + i][0].swiper.slidePrev(500, () => {});
					}
				});
				sliders[i].addEventListener('click', () => {
					if (this.$refs['mySwiper' + i][0].swiper) {
						this.$refs['mySwiper' + i][0].swiper.slideNext(500, () => {});
					}
				})
			}

		}, 2000);
	}
};
