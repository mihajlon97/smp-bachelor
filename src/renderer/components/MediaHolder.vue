<template>
	<div class="wrapper-parent">
		<!-- Media 1 -->
		<div class="media">
			<div class="wrapper">
				<button v-if="image1 && !playing" class="button button-play black round-btn button-control x-button" @click="reset(1)"> X </button>
				<div v-if="image1" class="move" :style="`background-size: contain; background-image: url('${get_blob(image1)};transform: scale(${scale1}) rotate(${rotate1}deg);`"></div>
				<h1 v-else class="chooseText" @click="choose(1)"> Choose Media </h1>
			</div>

			<!-- Filter Section -->
			<span v-if="image1 && !playing">
				<div style="position: absolute; bottom: 10px; right: 10px; z-index: 15;">
					<button @click="rotate1 += 90" class="filter-button button-play black round-btn button-control"> ⟳ </button>
					<button @click="reset(1, false)" class="filter-button button-play black round-btn button-control"> Reset </button>
				</div>
				<div style="position: absolute; bottom: 10px; left: 20px; z-index: 15;">
					<span style="color: white; font-size: 40px;"> Size: </span>
					<range-slider
							class="slider"
							min="0"
							max="2"
							step="0.1"
							v-model="scale1">
					</range-slider>
				</div>
			</span>
		</div>


		<!-- Media 2 -->
		<div class="media" style="left: 50%;">
			<div class="wrapper">
				<button v-if="image2 && !playing" class="button button-play black round-btn button-control x-button" @click="reset(2)"> X </button>
				<div v-if="image2" class="move" :style="`background-size: contain; background-image: url('${get_blob(image2)};transform: scale(${scale2}) rotate(${rotate2}deg);`"></div>
				<h1 v-else class="chooseText" @click="choose(2)"> Choose Media </h1>
			</div>

			<!-- Filter Section -->
			<span v-if="image2 && !playing">
				<div style="position: absolute; bottom: 10px; right: 10px; z-index: 15;">
					<button @click="rotate2 += 90" class="filter-button button-play black round-btn button-control"> ⟳ </button>
					<button @click="reset(2, false)" class="filter-button button-play black round-btn button-control"> Reset </button>
				</div>
				<div style="position: absolute; bottom: 10px; left: 20px; z-index: 15;">
					<span style="color: white; font-size: 40px;"> Size: </span>
					<range-slider
							class="slider"
							min="0"
							max="2"
							step="0.1"
							v-model="scale2">
					</range-slider>
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
		    image1_prop: {
		        type: String,
		        default: null
		    },
		    image2_prop: {
		        type: String,
		        default: null
		    },
			x1_prop: {
				type: String,
			    default: '0%'
			},
		    x2_prop: {
				type: String,
		        default: '0%'
			},
		    y1_prop: {
				type: String,
		        default: '0%'
			},
			y2_prop: {
				type: String,
			    default: '0%'
			},
			scale1_prop: {
				type: Number,
			    default: 1
			},
			scale2_prop: {
				type: Number,
			    default: 1
			},
			rotate1_prop: {
				type: Number,
			    default: 0
			},
		    rotate2_prop: {
				type: Number,
		        default: 0
		    },
		},
	    data() {
			return {
			    medias: [],
				image1: this.image1_prop,
				image2: this.image2_prop,
			    slides: [],
			    elem: null,
			    div: null,
			    x: [0,0],
			    y: [0,0],
			    rotate1: this.rotate1_prop,
			    rotate2: this.rotate2_prop,
			    scale1: this.scale1_prop,
			    scale2: this.scale2_prop,
			    mousedown: [false, false],
			}
	    },
	    mounted() {
	        console.log('Mounted', this.$props, this.$data);

	        setTimeout(() => {
	        	this.scale1 = this.scale1_prop;
	            this.scale2 = this.scale2_prop;
	        }, 3000);
	        this.init()

	    },
		computed: {
			...mapState(['activeSlide'])
		},
	    methods: {
		    reset (number, removePhoto = true) {
		    	this['scale' + number] = 1;
		    	this['rotate' + number] = 0;
		    	this.x[number] = 0;
		    	this.y[number] = 0;
		    	if (removePhoto) {
			      this['image' + number] = null;
			    }
		    },
		    scale (number, factor) {
		        this['scale' + number] += factor;
		    },



		    nextSlide () {
			    // If next slide exist
			    if (this.activeSlide + 1 < this.slides.length && this.slides.length > 0) {
		            // Save current slide modification
				    this.slides[this.activeSlide] = [
					    this.image1, this.medias[0].style.left, this.medias[0].style.top, this.scale1, this.rotate1,
					    this.image2, this.medias[1].style.left, this.medias[1].style.top, this.scale2, this.rotate2
				    ];
				    // Apply next one
				    this.$nextTick(() => {
					    this.init();

					    console.log('NEXT EXISTS ' + this.slides.length + ' Active ' + this.activeSlide);
					    // Slide 1
					    this.image1 = this.slides[this.activeSlide][0];
					    this.medias[0].style.left = this.slides[this.activeSlide][1];
					    this.medias[0].style.top = this.slides[this.activeSlide][2];
					    this.scale1 = this.slides[this.activeSlide][3];
					    this.rotate1 = this.slides[this.activeSlide][4];

					    // Slide 2
					    this.image2 = this.slides[this.activeSlide][5];
					    this.medias[1].style.left = this.slides[this.activeSlide][6];
					    this.medias[1].style.top = this.slides[this.activeSlide][7];
					    this.scale2 = this.slides[this.activeSlide][8];
					    this.rotate2 = this.slides[this.activeSlide][9];
				    });

				    // If next slide is empty
			    } else {
			        console.log('NEXT NOT EXISTS ' + this.slides.length + ' Active ' + this.activeSlide, this.slides);

			        // Prevent going on next slide if and images are picked or active slide is the last one
				    if ((!this.image1 || !this.image2) && (this.activeSlide === this.slides.length && this.slides.length > 0) ||
				      (this.slides.length === 0 && (!this.image1 || !this.image2))) return false;

				    this.slides[this.activeSlide] = [
					    this.image1, this.medias[0].style.left, this.medias[0].style.top, this.scale1, this.rotate1,
					    this.image2, this.medias[1].style.left, this.medias[1].style.top, this.scale2, this.rotate2
				    ];

				    this.reset(1, true);
				    this.reset(2, true);
			    }
			    console.log('Active ' + this.activeSlide, this.slides);

		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },
		    previousSlide () {
			    // If no slides prevent going back
			    if (this.slides.length === 0 || this.activeSlide === 0) return false;

		        console.log('PREVIOUS', this.medias, this.slides, "ACTIVE: " + this.activeSlide);

		        if (this.image1 && this.image2)
			        this.slides[this.activeSlide] = [
					    this.image1, this.medias[0].style.left, this.medias[0].style.top, this.scale1, this.rotate1,
					    this.image2, this.medias[1].style.left, this.medias[1].style.top, this.scale2, this.rotate2
				    ];

			    this.reset(1, true);
			    this.reset(2, true);

			    // Slide 1
			    this.image1 = this.slides[this.activeSlide - 1][0];

			    // Slide 2
			    this.image2 = this.slides[this.activeSlide - 1][5];

			    console.log('SLIDES', this.slides, "ACTIVE: " + this.activeSlide);

		        this.$nextTick(() => {
		        	this.init();

		        	console.log("ACTIVE: " + this.activeSlide);

				    this.medias[0].style.left = this.slides[this.activeSlide][1];
				    this.medias[0].style.top = this.slides[this.activeSlide][2];
				    this.scale1 = this.slides[this.activeSlide][3];
				    this.rotate1 = this.slides[this.activeSlide][4];

				    this.medias[1].style.left = this.slides[this.activeSlide][6];
				    this.medias[1].style.top = this.slides[this.activeSlide][7];
				    this.scale2 = this.slides[this.activeSlide][8];
				    this.rotate2 = this.slides[this.activeSlide][9];
		        });
		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },


		    edit (presentation) {
			    presentation.slides.forEach(slide => {
				    this.slides.push([
					    // Slide 1
					    slide.image1.path, slide.image1.startX, slide.image1.startY, slide.image1.scale, slide.image1.orientation,
					    // Slide 2
					    slide.image2.path, slide.image2.startX, slide.image2.startY, slide.image2.scale, slide.image2.orientation,
				    ]);
			    });

			    // Slide 1
			    this.image1 = this.slides[this.activeSlide][0];

			    // Slide 2
			    this.image2 = this.slides[this.activeSlide][5];

			    console.log('SLIDES', this.slides, "ACTIVE: " + this.activeSlide);

			    this.$nextTick(() => {
				    this.init();

				    console.log("ACTIVE: " + this.activeSlide);

				    this.medias[0].style.left = this.slides[this.activeSlide][1];
				    this.medias[0].style.top = this.slides[this.activeSlide][2];
				    this.scale1 = this.slides[this.activeSlide][3];
				    this.rotate1 = this.slides[this.activeSlide][4];

				    this.medias[1].style.left = this.slides[this.activeSlide][6];
				    this.medias[1].style.top = this.slides[this.activeSlide][7];
				    this.scale2 = this.slides[this.activeSlide][8];
				    this.rotate2 = this.slides[this.activeSlide][9];
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
			    if (this.image1 && this.image2) {
				    this.slides[this.activeSlide] = [
					    this.image1, this.medias[0].style.left, this.medias[0].style.top, this.scale1, this.rotate1,
					    this.image2, this.medias[1].style.left, this.medias[1].style.top, this.scale2, this.rotate2
				    ];
			    }


			    this.slides.unshift([
				    'path_1', 'startX_1', 'startY_1', 'scale_1', 'orientation_1',
				    'path_2', 'startX_2', 'startY_2', 'scale_2', 'orientation_2'
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

			    for(let index = 0; this.wrappers.length; index++) {
					let div = this.wrappers[index];

					if (this.medias.length === 0 || !div) return;

					if (this.medias[index]) {

						// Calculate x and y in %
						this.medias[index].style.left = this['x' + (index + 1) + '_prop'];
						this.medias[index].style.top = this['y' + (index + 1) + '_prop'];


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

					// element mousemove to stop
					div.addEventListener('mousemove', (e) => {
						// Is mouse pressed
						if (this.medias[index] && this.medias[index].mousedown) {
						    // Calculate x and y in %
						    this.medias[index].style.left = (((e.clientX + this.medias[index].x) * 100) / this.medias[index].offsetWidth) + '%';
						    this.medias[index].style.top = (((e.clientY + this.medias[index].y) * 100) / this.medias[index].offsetHeight) + '%';
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
						this['image' + number] = files[0];
						this.$nextTick(this.init);
					}
				});
			},
	    }
	}

</script>

<style>
	.wrapper-parent{
		width: 100%;
		height: 100%;
		background-color: black;
	}

	.media {
		margin: 0;
		position: absolute;
		width: 50%;
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
	}
	.filter-button {
		padding: 10px 20px;
		font-size: 18px!important;
	}
</style>
