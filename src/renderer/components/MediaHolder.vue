<template>
	<div class="wrapper-parent">
			<!-- Context Menu -->
			<div v-show="menu_opened" ref="menu" @click="menu_opened = false" class="context-menu">
				<ul>
					<li @click="media[selected].z_index = 9">Move to Back </li>
					<li @click="media[selected].z_index = 10">Move to Middle</li>
					<li @click="media[selected].z_index = 11">Move to Front</li>
					<li class="remove-option" @click="reset(selected, true)"> Remove</li>
				</ul>
			</div>

			<!-- Media -->
			<div class="wrapper">
				<Media v-for="i in media.length" :key="'media-' + i" :class="(( media[i - 1].selected) ? 'selected' : '')"
				       :style="`transform: scale(${media[i - 1].scale}) rotate(${media[i - 1].rotate}deg); top:${media[i - 1].startY}; left:${media[i - 1].startX}; z-index:${media[i - 1].z_index};`"
				       v-if="media[i - 1] && media[i - 1].path"
				       :path="media[i - 1].path"
				       :index="i"
				       @remove="reset(i - 1, true)"
				       @contextmenu.native.prevent="menu_open($event)"
				/>

				<div v-if="media.length === 0" @click="choose" style="text-align: center; padding: 40px; border: 3px solid white; border-radius: 50px; height: 50%; width: 70%; cursor: pointer; margin: 10% auto 0;">
					<h1 style="text-align: center; color: white; width: 100%; top: 45%; position: relative;">
						Drag & Drop Media Here
					</h1>
				</div>

				<!-- Filter Section -->
				<span v-if="selected !== null && !playing">
					<div style="position: absolute; bottom: 10px; right: 50px; z-index: 15;">
						<button @click="reset(selected, false)" class="filter-button button-play black round-btn button-control"> Reset </button>
						<button @click="reset(selected, true)"  class="filter-button button-play black round-btn button-control"> Remove </button>
					</div>
					<div style="position: absolute; bottom: 10px; left: 50px; z-index: 15;">
						<button @click="rotate(selected)" class="filter-button button-play black round-btn button-control">⟳</button>
						<button @click="scale(selected, 0.1)" class="filter-button button-play black round-btn button-control">＋</button>
						<button @click="scale(selected, -0.1)" class="filter-button button-play black round-btn button-control">－</button>
					</div>
				</span>
			</div>
	</div>
</template>

<script>
	import RangeSlider from 'vue-range-slider'
	import 'vue-range-slider/dist/vue-range-slider.css'
	import { mapState } from 'vuex';
	import Media from "./Media";
	const { dialog } = require('electron').remote;

	export default {
		name: "MediaHolder",
		components: {
			Media,
			RangeSlider,
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
		    }
		},
	    data() {
			return {
			    menu_opened: false,
			    media: this.media_prop,
			    medias: [],
			    wrappers: [],
			    slides: [],
			    selected: null
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
				    this.media[this.media.length] = {
					    path: f.path,
					    startX: '0%',
					    startY: '0%',
					    scale: 0.5,
				        z_index: 10,
					    rotate: 0,
				        selected: false
				    };
				    this.$forceUpdate();
				    this.$nextTick(this.init);
			        this.$forceUpdate();
			    }
		        console.log('MEDIA', this.media);
		        return false;
		    };

	    },
		computed: {
			...mapState(['activeSlide']),
		    anyMediaSelected() {
				return this.media.filter(m => m.selected === true).length > 0
		    }
		},
	    methods: {
		    rotate(index) {
		    	this.media[index].rotate += 90;
		    	this.$forceUpdate();
		    },
	        scale (index, factor) {
	            this.media[index].scale += factor;
	            this.$forceUpdate();
	        },

		    anyMediaLeft() {
			    let result = false;
			    for (let i = 0; i < this.media.length; i++) {
				    if (!this.media[i] || !this.media[i].path) result = true;
			    }
			    return result;
		    },
		    menu_open(e) {
			    this.menu_opened = !this.menu_opened;
			    this.$refs.menu.style.left = e.x + 'px';
			    this.$refs.menu.style.top = e.y + 'px';
		    },
		    reset (index, removePhoto = true) {
		    	if (removePhoto) {
				    for(let i = this.media.length - 1; i >= 0; i--){
					    if (parseInt(i) === parseInt(index)){
					    	this.media.splice(i, 1);
					    }
				    }
			    }
		    	else {
				    this.media[index] = {
					    path: this.media[index].path,
					    startX: '0%',
					    startY: '0%',
					    scale: 0.5,
				        z_index: 10,
					    rotate: 0,
				        selected: false
				    };
			        this.medias[index].style.left = '0%';
			        this.medias[index].style.top = '0%';
			    }
		        this.$forceUpdate();
		        this.$nextTick(this.init);
		    },



		    nextSlide () {
		    	console.log('MEDIA', this.media);
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

					    for (let i = 0; i < this.media.length; i++) {
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

				    console.log('NEXT NOT EXIST', this.media, this.slides);
				    // Save current slide modification
				    let slide = [];
				    for (let i = 0; i < this.media.length; i++) {
					    slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
					    this.reset(i, true);
				    }
				    /*
				    this.media.forEach((media, i) => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				        this.reset(i, true);
				    });
				    */
				    this.slides[this.activeSlide] = slide;
			    }
			    console.log(this.slides, this.media);
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

			    for (let i = 0; i < this.media.length; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide - 1][(5 * i)],
				    }
			    }
		        this.$nextTick(() => {
		        	this.init();

			        for (let i = 0; i < this.media.length; i++) {
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

			    for (let i = 0; i < this.media.length; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide][(5 * i)],
				    }
			    }

			    this.$nextTick(() => {
				    this.init();

				    for (let i = 0; i < this.media.length; i++) {
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

			    for(let index = 0; index < this.media.length; index++) {
					let div = this.wrappers[0];

					if (this.medias.length === 0 || !div) return;

					if (this.medias[index]) {
						// Calculate x and y in %
						this.medias[index].style.left = !this.medias[index].style.left ? this.media_prop[index].startX : this.medias[index].style.left;
						this.medias[index].style.top = !this.medias[index].style.top ? this.media_prop[index].startY : this.medias[index].style.top;


						// Mousedown when mouse leave
						this.medias[index].addEventListener('mouseleave', (e) => {
							this.medias[index].mousedown = false;
						});

						this.medias[index].addEventListener('mousedown', (e) => {
							// mouse state set to true
						    this.medias[index].mousedown = true;
						    this.media[index].selected = !this.media[index].selected;

						    // Deselect other medias
						    if (this.media[index].selected === true) {
							    for(let i = 0; i < this.media.length; i++) {
							        if(i !== index) this.media[i].selected = false
							    }
								this.selected = index;
							}
							this.$forceUpdate();

						    // Subtract offset
							this.medias[index].dim_x = this.medias[index].offsetLeft - e.clientX;
							this.medias[index].dim_y = this.medias[index].offsetTop - e.clientY;
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
						    this.media[index].selected = true;
						    this.selected = index;
						    this.$forceUpdate();

							// Calculate x and y in %
						    this.medias[index].style.left = (((e.clientX + this.medias[index].dim_x) / div.offsetWidth) * 100) + '%';
							this.medias[index].style.top = (((e.clientY + this.medias[index].dim_y) / div.offsetHeight) * 100) + '%';

						    this.media[index].startX = (((e.clientX + this.medias[index].dim_x) / div.offsetWidth) * 100) + '%';
						    this.media[index].startY = (((e.clientY + this.medias[index].dim_y) / div.offsetHeight) * 100) + '%';
						}
					}, true);
			    }
			    this.$forceUpdate();
			},
			choose() {
				dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{ name: 'Image/Video', extensions: ['jpg', 'png', 'gif', 'mp4'] },
					]
				}, (files) => {
					if (files) {
						this.media[this.media.length] = {
							path: files[0],
						    startX: '0%',
						    startY: '0%',
						    scale: 0.5,
						    z_index: 10,
						    rotate: 0,
						    selected: false
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
	.selected {
		outline-style: solid;
		outline-color: cornflowerblue;
	}
	.context-menu {
		border-radius: 10px;
		position: absolute;
		z-index: 15;
	}

	.context-menu ul {
		border-radius: 10px;
		list-style-type: none;
		margin: 0;
		padding: 0;
		width: 300px!important;
		background-color: #f1f1f1;
	}

	.context-menu li {
		border-radius: 10px;
		display: block;
		color: #000;
		padding: 16px 32px;
		text-decoration: none;
		font-size: 24px;
	}

	/* Change the link color on hover */
	.context-menu li:hover {
		background-color: #555;
		color: white;
	}

	.context-menu .remove-option {
		background-color: rgba(255, 0, 0, 0.69);
		color: white;
	}
	.context-menu .remove-option:hover {
		background-color: rgba(172, 0, 0, 0.79);
		color: white;
	}
</style>
