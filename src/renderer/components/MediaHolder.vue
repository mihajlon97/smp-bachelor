<template>
	<div class="wrapper-parent">
		<button class="button" style="position: absolute; top: 100px; color: white; z-index: 124124214;" @click="choose(media.length)"> Choose Media </button>

		<!-- Media -->
			<div class="wrapper">
				<img v-for="i in media_count" :key="'media-' + i"  class="move"
				     v-if="media[i - 1] && media[i - 1].path && media[i - 1].path.indexOf('.mp4') === -1"
				     :class="'media-nr-' + media_count"
				     ondragstart="return false;" :style="`transform: scale(${media[i - 1].scale}) rotate(${media[i - 1].rotate}deg); top:${media[i - 1].startY}; left:${media[i - 1].startX};`"
				     :src="get_blob(media[i - 1].path)" style="margin: 0;" alt="">
				<video v-else-if="media[i - 1] && media[i - 1].path && media[i - 1].path.indexOf('.mp4') !== -1" autoplay muted loop
				       :class="'media-nr-' + media_count" class="move" style="position:absolute; object-fit: contain;">
					<source :src="get_blob(media[i - 1].path)" type="video/mp4">
				</video>
			</div>

			<!-- Filter Section -->
			<span v-if="false && media[i - 1] && media[i - 1].path && !playing">
				<div v-if="i !== media_count || i === 1" style="position: absolute; bottom: 10px; right: -23px; z-index: 15;">
					<button @click="switchMedia(i - 1, i)" class="filter-button button-play black round-btn button-control">⇄</button>
				</div>
				<div v-else style="position: absolute; bottom: 10px; left: -23px; z-index: 15;">
					<button @click="switchMedia(i - 2, i - 1)" class="filter-button button-play black round-btn button-control">⇄</button>
				</div>
				<div style="position: absolute; bottom: 10px; right: 50px; z-index: 15;">
					<button @click="reset(i - 1, false)" class="filter-button button-play black round-btn button-control"> Reset </button>
					<button @click="reset(i - 1, true)"  class="filter-button button-play black round-btn button-control"> Remove </button>
				</div>
				<div style="position: absolute; bottom: 10px; left: 50px; z-index: 15;">
					<button @click="rotate(i)" class="filter-button button-play black round-btn button-control">⟳</button>
					<button @click="scale(i, 0.1)" class="filter-button button-play black round-btn button-control">＋</button>
					<button @click="scale(i, -0.1)" class="filter-button button-play black round-btn button-control">－</button>
				</div>
			</span>
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
			media_count: {
				type: Number,
				default: 2
			},
		},
	    data() {
			return {
			    media: this.media_prop,
			    medias: [],
			    wrappers: [],
			    slides: [],
			}
	    },
	    mounted() {
	        this.init();

		    let holder = document.getElementsByClassName('wrapper')[0];

		    holder.ondragover = () => { return false; };
		    holder.ondragleave = () => { return false; };
		    holder.ondragend = () => { return false; };

		    holder.ondrop = (e) => {
			    e.preventDefault();
			    for (let f of e.dataTransfer.files) {
				    console.log('File(s) you dragged here: ', f.path)
				    this.media[this.media.length] = {
					    path: f.path,
					    startX: '0%',
					    startY: '0%',
					    scale: 1,
					    rotate: 0
				    };
				    if (this.media.length > this.media_count) this.media_count = this.media.length;
				    this.$forceUpdate();
				    this.$nextTick(this.init);
			    }
			    return false;
		    };

	    },
		computed: {
			...mapState(['activeSlide']),
		},
	    methods: {
		    switchMedia(indexFirst, indexSecond) {
		      let help = this.media[indexFirst];
		      this.media[indexFirst] = this.media[indexSecond];
		      this.media[indexSecond] = {...help};
		      this.$forceUpdate();
		      this.$nextTick(this.init);
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
		    reset (index, removePhoto = true) {
		    	if (removePhoto) this.media[index] = {};
		    	else {
				    this.media[index] = {
					    path: this.media[index].path,
					    startX: '0%',
					    startY: '0%',
					    scale: 1,
					    rotate: 0,
				    };
			        this.medias[index].style.left = '0%';
			        this.medias[index].style.top = '0%';
			    }
		        this.$forceUpdate();
		        this.$nextTick(this.init);
		    },



		    nextSlide () {
			    // If next slide exist
			    if (this.activeSlide + 1 < this.slides.length && this.slides.length > 0) {

		            // Save current slide modification
			        let slide = [];
			        this.media.forEach(media => {
			        	slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
			        });
				    this.slides[this.activeSlide] = slide;

				    // Apply next one
				    this.$nextTick(() => {
					    this.init();

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

			        // Prevent going on next slide if and images are picked or active slide is the last one
				    if (this.anyMediaLeft() && (this.activeSlide === this.slides.length && this.slides.length > 0) ||
				       (this.anyMediaLeft() && this.slides.length === 0)) return false;

				    // Save current slide modification
				    let slide = [];
				    this.media.forEach((media, i) => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				        this.reset(i, true);
				    });
				    this.slides[this.activeSlide] = slide;
			    }
		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },
		    previousSlide () {
			    // If no slides prevent going back
			    if (this.slides.length === 0 || this.activeSlide === 0) return false;

		        if (!this.anyMediaLeft()) {
			        // Save current slide modification
			        let slide = [];
			        this.media.forEach((media, i) => {
				        slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
			            this.reset(i);
			        });
			        this.slides[this.activeSlide] = slide;
		        }

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
			        this.$forceUpdate();
		        });
		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },


		    edit (presentation) {
			    presentation.slides.forEach(slide => {
				    let slideToAdd = [];
				    slide.forEach(media => {
				        slideToAdd.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    this.slides.push(slideToAdd);
			    });

				console.log('MEDIA COUNT ' + this.media_count, this.media, presentation.slides);
			    for (let i = 0; i < this.media_count; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide][(5 * i)],
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

			    let columnNames = [];
			    if (!this.anyMediaLeft()) {
				    // Save current slide modification
				    let slide = [];
				    this.media.forEach((media, i) => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				        columnNames.push(
				        	'path_' + (i + 1),
				            'startX_' + (i + 1),
				            'startY_'  + (i + 1),
				            'scale_'  + (i + 1),
				            'rotate_'  + (i + 1)
				        );
				    });
				    this.slides[this.activeSlide] = slide;
			    }

			    // Add column names at the beginning
			    this.slides.unshift(columnNames);

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

			    console.log("INIT", this.media);
			    for(let index = 0; index < this.media.length; index++) {
					let div = this.wrappers[0];

					if (this.medias.length === 0 || !div) return;

					if (this.medias[index]) {
						// Calculate x and y in %
						this.medias[index].style.left = !this.medias[index].style.left ? this.media_prop[index].startX : this.medias[index].style.left;
						this.medias[index].style.top = !this.medias[index].style.top ? this.media_prop[index].startY : this.medias[index].style.top;

						// div event mousedown
						this.medias[index].addEventListener('mousedown', (e) => {
							// mouse state set to true
						    this.medias[index].mousedown = true;
						    console.log('MOUSE DOWN!!!');
						    console.log("L: " +this.medias[index].offsetLeft + ' T: ' + this.medias[index].offsetTop);
						    console.log("X: " + e.clientX + ' Y: ' + e.clientY);
						    let x = (e.pageX - this.medias[index].offsetLeft), y = (e.pageY - this.medias[index].offsetTop);
							// subtract offset
							this.medias[index].dim_x = e.clientX - parseInt(this.medias[index].style.left || 0);
							this.medias[index].dim_y = e.clientY - parseInt(this.medias[index].style.top || 0);

							console.log("DIM X, Y", this.medias[index].dim_x, this.medias[index].dim_y)
						}, false);

						// div event mouseup
						this.medias[index].addEventListener('mouseup', (e) => {
							// mouse state set to false
						    this.medias[index].mousedown = false;
							console.log('X: ' + this.medias[index].dim_x + ' Y: ' + this.medias[index].dim_y);
						    console.log('W: ' +this.medias[index].clientWidth + ' H: ' + this.medias[index].clientHeight);
						}, true);
					}

					// Element mousemove to stop
					div.addEventListener('mousemove', (e) => {
					    // Is mouse pressed
						if (this.medias[index] && this.medias[index].mousedown) {
							console.log('X: ' + this.medias[index].dim_x + ' Y: ' + this.medias[index].dim_y);
							console.log('W: ' +this.medias[index].clientWidth + ' H: ' + this.medias[index].clientHeight);
							let l = (e.pageX - this.medias[index].clientWidth), t = (e.pageY - this.medias[index].clientHeight);
						    // Calculate x and y in %
						    // this.medias[index].style.left = (((e.clientX + this.medias[index].dim_x) * 100) / this.medias[index].offsetWidth) + '%';
						    this.medias[index].style.left = (e.clientX - this.medias[index].dim_x) + 'px';
							// this.medias[index].style.top = (((e.clientY + this.medias[index].dim_y) * 100) / this.medias[index].offsetHeight) + '%';
							this.medias[index].style.top = (e.clientY - this.medias[index].dim_y) + 'px';

							console.log("T: " + this.medias[index].style.top  + " L: " + this.medias[index].style.left);
							// this.media[index].startX = (((e.clientX + this.medias[index].dim_x) * 100) / this.medias[index].offsetWidth) + '%';
						    // this.media[index].startY = (((e.clientY + this.medias[index].dim_y) * 100) / this.medias[index].offsetHeight) + '%';
						}
					}, true);
			    }
			    this.$forceUpdate();
			},
			choose(number) {
				dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{ name: 'Image/Video', extensions: ['jpg', 'png', 'gif', 'mp4'] },
					]
				}, (files) => {
					if (files) {
						this.media[number] = {
							path: files[0],
						    startX: '0%',
						    startY: '0%',
						    scale: 1,
						    rotate: 0
						};
					    this.$forceUpdate();
						this.$nextTick(this.init);
					}
				});
			},
	    }
	}

</script>

<style>

</style>
