<template>
	<div class="wrapper-parent">
		<!-- Media -->
		<div class="media" v-for="i in media_count" :key="'media-' + i" :class="'media-nr-' + media_count">
			<div class="wrapper">
				<div v-if="media[i - 1] && media[i - 1].path" class="move" :style="`background-size: contain; background-image: url('${get_blob(media[i - 1].path)};transform: scale(${media[i - 1].scale}) rotate(${media[i - 1].rotate}deg); top:${media[i - 1].startY}; left:${media[i - 1].startX};`"></div>
				<h1 v-else class="chooseText" @click="choose(i)"> Choose Media </h1>
			</div>

			<!-- Filter Section -->
			<span v-if="media[i - 1] && media[i - 1].path && !playing">
				<div v-if="i !== media_count" style="position: absolute; bottom: 10px; right: -23px; z-index: 15;">
					<button @click="switchMedia(i - 1, i)" class="filter-button button-play black round-btn button-control">⇄</button>
				</div>
				<div v-else style="position: absolute; bottom: 10px; left: -23px; z-index: 15;">
					<button @click="switchMedia(i - 2, i - 1)" class="filter-button button-play black round-btn button-control">⇄</button>
				</div>
				<div style="position: absolute; bottom: 10px; right: 50px; z-index: 15;">
					<button @click="reset(i, false)" class="filter-button button-play black round-btn button-control"> Reset </button>
					<button @click="reset(i, true)"  class="filter-button button-play black round-btn button-control"> Remove </button>
				</div>
				<div style="position: absolute; bottom: 10px; left: 50px; z-index: 15;">
					<button @click="rotate(i)" class="filter-button button-play black round-btn button-control">⟳</button>
					<button @click="scale(i, 0.1)" class="filter-button button-play black round-btn button-control">＋</button>
					<button @click="scale(i, -0.1)" class="filter-button button-play black round-btn button-control">－</button>
				</div>
			</span>
		</div>
	</div>
</template>

<script>
	import RangeSlider from 'vue-range-slider'
	import 'vue-range-slider/dist/vue-range-slider.css'
	import { mapState } from 'vuex';
	const { dialog } = require('electron').remote;
	export default {
		name: "MediaHolder",
		components: {
			RangeSlider
		},
		props: {
		    id: {
		        type: String,
		        default: 'id'
		    },
			playing: {
				type: Boolean,
			    default: false
			},
		    media_prop: {
		        type: Array,
		        default: () =>  []
		    },
		},
	    data() {
			return {
			    media_count: 2,
			    media: this.media_prop,
			    medias: [],
			    slides: [],
			}
	    },
	    mounted() {
	        console.log('Mounted', this.$props, this.$data);
	        this.init()
	    },
		computed: {
			...mapState(['activeSlide']),
		},
	    methods: {
		    switchMedia(indexFirst, indexSecond) {
		      let help = this.media[indexFirst];
		      this.media[indexFirst] = this.media[indexSecond];
		      this.media[indexSecond] = {...help};
		      this.$nextTick(this.init);
		      this.$forceUpdate();
		    },
		    rotate(i) {
		    	this.media[i - 1].rotate += 90;
		    	this.$forceUpdate();
		    },
	        scale (number, factor) {
	            this.media[number - 1].scale += factor;
	            this.$forceUpdate();
	        },

		    anyMediaLeft() {
			    let result = false;

			    for (let i = 0; i < this.media_count; i++) {
				    if (!this.media[i] || !this.media[i].path) result = true;
			    }

			    return result;
		    },
		    reset (number, removePhoto = true) {
		    	if (removePhoto) this.media[number - 1] = {};
		    	else {
				    this.media[number - 1] = {
					    path: this.media[number - 1].path,
					    startX: '0%',
					    startY: '0%',
					    scale: 1,
					    rotate: 0,
				    };
			        this.medias[number - 1].style.left = '0%';
			        this.medias[number - 1].style.top = '0%';
			    }
		        this.$nextTick(this.init);
		        this.$forceUpdate();
		    },



		    nextSlide () {
			    // If next slide exist
			    if (this.activeSlide + 1 < this.slides.length && this.slides.length > 0) {

		            // Save current slide modification
			        let slide = [];
			        this.media.forEach(media => {
			        	slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
			        });
			        console.log(slide);
				    this.slides[this.activeSlide] = slide;

				    // Apply next one
				    this.$nextTick(() => {
					    this.init();

					    console.log('NEXT EXISTS ' + this.slides.length + ' Active ' + this.activeSlide);
					    for (let i = 0; i < this.media_count; i++) {
					    	this.media[i] = {
					    		path: this.slides[this.activeSlide][(5 * i)],
					    		startX: this.slides[this.activeSlide][1 + 5 * i],
					    		startY: this.slides[this.activeSlide][2 + 5 * i],
					    		scale: this.slides[this.activeSlide][3 + 5 * i],
					    		rotate: this.slides[this.activeSlide][4 + 5 * i],
						    }
					    }
				    });

				    // If next slide is empty
			    } else {
			        console.log('NEXT NOT EXISTS ' + this.slides.length + ' Active ' + this.activeSlide, this.slides, this.anyMediaLeft(), this.media);

			        // Prevent going on next slide if and images are picked or active slide is the last one
				    if (this.anyMediaLeft() && (this.activeSlide === this.slides.length && this.slides.length > 0) ||
				       (this.anyMediaLeft() && this.slides.length === 0)) return false;

				    console.log('EME')
				    // Save current slide modification
				    let slide = [];
				    this.media.forEach(media => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    this.slides[this.activeSlide] = slide;

				    this.reset(1, true);
				    this.reset(2, true);
			    }
		        console.log("ACTIVE: " + this.activeSlide, "SLIDES", this.slides, "MEDIA", this.media);

		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },
		    previousSlide () {
			    // If no slides prevent going back
			    if (this.slides.length === 0 || this.activeSlide === 0) return false;

		        console.log('PREVIOUS', this.media, this.slides, "ACTIVE: " + this.activeSlide, this.anyMediaLeft());

		        if (!this.anyMediaLeft()) {
			        // Save current slide modification
		            console.log('Save current slide modification')
			        let slide = [];
			        this.media.forEach(media => {
				        slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
			        });
			        this.slides[this.activeSlide] = slide;
		        }

			    this.reset(1);
			    this.reset(2);

			    console.log('SLIDES', this.slides, "ACTIVE: " + this.activeSlide, this.media);

			    for (let i = 0; i < this.media_count; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide - 1][(5 * i)],
				    }
			    }
		        this.$nextTick(() => {
		        	this.init();

			        for (let i = 0; i < this.media_count; i++) {
				        this.media[i] = {
				            ...this.media[i],
					        // path: this.slides[this.activeSlide][(5 * i)],
					        startX: this.slides[this.activeSlide][1 + 5 * i],
					        startY: this.slides[this.activeSlide][2 + 5 * i],
					        scale: this.slides[this.activeSlide][3 + 5 * i],
					        rotate: this.slides[this.activeSlide][4 + 5 * i],
				        }
			        }
		            console.log("ACTIVE: " + this.activeSlide, "SLIDES", this.slides, "MEDIA", this.media);
			        this.$forceUpdate();
		        });
		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },


		    edit (presentation) {
		    	console.log(presentation);
			    presentation.slides.forEach(slide => {

				    let slideToAdd = [];
				    slide.forEach(media => {
				        slideToAdd.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });

				    this.slides.push(slideToAdd);
			    });

			    console.log('SLIDES', this.slides, "ACTIVE: " + this.activeSlide);

			    for (let i = 0; i < this.media_count; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide][(5 * i)],
				    }
			    }

			    this.$nextTick(() => {
				    this.init();

				    console.log("ACTIVE: " + this.activeSlide, "MEDIA", this.media);

				    for (let i = 0; i < this.media_count; i++) {
					    this.media[i] = {
					        ...this.media[i],
						    // path: this.slides[this.activeSlide][(5 * i)],
						    startX: this.slides[this.activeSlide][1 + 5 * i],
						    startY: this.slides[this.activeSlide][2 + 5 * i],
						    scale: this.slides[this.activeSlide][3 + 5 * i],
						    rotate: this.slides[this.activeSlide][4 + 5 * i],
					    }
				    }
			        this.$forceUpdate();
			    });
			    this.$emit('updateTotalSlides', this.slides.length);
		    },


		    async save (name, edit = false, id = '') {
			    // Write to storage
			    const presentationId = !edit ? this.uuidv4() : id;
			    const XLSX = require('xlsx');
			    const path = require('path');
			    const storageDir = path.join(require('electron').remote.app.getPath('userData'), '\\presentations.xlsx');
			    const presentationDir = path.join(require('electron').remote.app.getPath('userData'), '\\presentation-' + presentationId + '.xlsx');
			    const workbook = XLSX.readFile(path.join(storageDir));
			    const sheet_name_list = workbook.SheetNames;
			    const sheet = workbook.Sheets[sheet_name_list[0]];
			    const presentations = XLSX.utils.sheet_to_json(sheet);

			    console.log('ACTIVE SLIDE ' + this.activeSlide, "SLIDES " + this.slides.length, this.slides);
			    if (!this.anyMediaLeft()) {
				    // Save current slide modification
				    let slide = [];
				    this.media.forEach(media => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    console.log(slide);
				    this.slides[this.activeSlide] = slide;
			    }

			    this.slides.unshift([
				    'path_1', 'startX_1', 'startY_1', 'scale_1', 'rotate_1',
				    'path_2', 'startX_2', 'startY_2', 'scale_2', 'rotate_2'
			    ]);

			    const book = XLSX.utils.book_new();
			    const sheet1 = XLSX.utils.aoa_to_sheet(this.slides);
			    XLSX.utils.book_append_sheet(book, sheet1, 'sheet1');

			    // If create mode
			    if (edit === false) {
				    presentations.push({
					    id: presentationId,
					    name: name,
					    file: presentationDir
				    });

				    workbook.Sheets[sheet_name_list[0]] = XLSX.utils.json_to_sheet(presentations);
				    XLSX.writeFile(workbook, storageDir);
			    } else {
				    // If edit mode - remove last presentation
				    if (!require('fs').existsSync(presentationDir)) {
					    require('fs').unlinkSync(presentationDir)
				    }
			    }
			    XLSX.writeFile(book, presentationDir);

			    this.$router.push('/');
			    this.$swal("Good job!", "Your presentation is ready!", "success");
		    },
			init() {
			    let container = this.playing ? document.querySelector('#' + this.id) : document;
				this.wrappers = [...container.querySelectorAll('.wrapper')];
			    this.medias = [...container.querySelectorAll('.move')];



			    for(let index = 0; index < this.media_count; index++) {
					let div = this.wrappers[index];

				    if (this.playing) {
				    	console.log('PLAYING INIT')
				    }

					if (this.medias.length === 0 || !div) return;

					if (this.medias[index]) {

						// Calculate x and y in %
						this.medias[index].style.left = !this.medias[index].style.left ? this.media_prop[index].startX : this.medias[index].style.left;
						this.medias[index].style.top = !this.medias[index].style.top ? this.media_prop[index].startY : this.medias[index].style.top;

						// div event mousedown
						this.medias[index].addEventListener('mousedown', (e) => {
							// mouse state set to true
						    this.medias[index].mousedown = true;
							// subtract offset
							this.medias[index].x = this.medias[index].offsetLeft - e.clientX;
							this.medias[index].y = this.medias[index].offsetTop - e.clientY;
						}, true);

						// div event mouseup
						this.medias[index].addEventListener('mouseup', (e) => {
							// mouse state set to false
						    this.medias[index].mousedown = false;
						}, true);
					}

					// Element mousemove to stop
					div.addEventListener('mousemove', (e) => {
						// Is mouse pressed
						if (this.medias[index] && this.medias[index].mousedown) {
						    // Calculate x and y in %
						    this.medias[index].style.left = (((e.clientX + this.medias[index].x) * 100) / this.medias[index].offsetWidth) + '%';
							this.medias[index].style.top = (((e.clientY + this.medias[index].y) * 100) / this.medias[index].offsetHeight) + '%';

							this.media[index].startX = (((e.clientX + this.medias[index].x) * 100) / this.medias[index].offsetWidth) + '%';
						    this.media[index].startY = (((e.clientY + this.medias[index].y) * 100) / this.medias[index].offsetHeight) + '%';
						}
					}, true);
			    }
			},
			choose(number) {
				dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{ name: 'Images', extensions: ['jpg', 'png', 'gif'] },
					]
				}, (files) => {
					if (files) {
						this.media[number - 1] = {
							path: files[0],
						    startX: '0%',
						    startY: '0%',
						    scale: 1,
						    rotate: 0
						};
						this.$nextTick(this.init);
					    this.$forceUpdate();
					}
				});
			},
	    }
	}

</script>

<style>
	.media-nr-1 {
		width: 100%;
	}
	.media-nr-2 {
		width: 50%;
	}
	.media-nr-3 {
		width: 33.33%;
	}
	.media-nr-4 {
		width: 25%;
	}

	.wrapper-parent{
		width: 100%;
		height: 100%;
		background-color: black;
	}

	.media {
		margin: 0;
		position: relative;
		float: left;
		height: 100%;
		color: white;
	}
	.chooseText {
		text-align: center;
		vertical-align: middle;
		line-height: 100vh;
		cursor: pointer;
	}

	.wrapper {
		overflow: hidden;
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.move img {
		cursor: pointer;
		position: absolute;
	}
	.move:hover {
		cursor: pointer;
	}
	.move:active {
		cursor: move;
	}

	/*
			position: absolute;
	    left: 0;
	    top: 0;
	 */
	.move {
		position: relative;
		z-index: 10;
	    width: 100%;
	    height: 100%;
		background: black no-repeat center;
		transition: transform 1s;
	}
	.filter-button {
		padding: 10px 12px;
		font-size: 20px!important;
	}
	button {
		cursor: pointer;
	}
</style>
