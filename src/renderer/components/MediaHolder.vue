<template>
	<div class="wrapper-parent">
			<!-- Context Menu -->
			<div v-show="menu_opened && !playing" ref="menu" @click="menu_opened = false" class="context-menu">
				<ul>
					<li @click="media[selected].z_index -= 1">Move to Back </li>
					<li @click="media[selected].z_index += 1">Move to Front</li>
					<li class="remove-option" @click="reset(selected, true)"> Remove</li>
				</ul>
			</div>

			<!-- Media width: ${width}px; height: ${height}px; -->
			<div class="wrapper" :style="`width: ${width}px; height: ${height}px;`">
				<Media v-for="i in media.length" :key="'media-' + i" :class="(( media[i - 1].selected && !playing) ? 'selected' : '')"
				       :style="`top:${media[i - 1].startY}; left:${media[i - 1].startX}; transform: scale(${media[i - 1].scale}) translate(${media[i - 1].translate[0]}%, ${media[i - 1].translate[1]}%) rotate(${media[i - 1].rotate}deg); z-index:${media[i - 1].z_index};`"
				       v-if="media[i - 1] && media[i - 1].path"
				       :path="media[i - 1].path"
				       :index="i"
				       @remove="reset(i - 1, true)"
				       @contextmenu.native.prevent="menu_open($event)"
				       @click.native="menu_opened = false"
				/>

				<!-- Drag & Drop -->
				<div v-if="media.length === 0" @click="choose" style="text-align: center; padding: 40px; border: 3px solid white; border-radius: 50px; height: 50%; width: 70%; cursor: pointer; margin: 10% auto 0;">
					<h1 style="text-align: center; color: white; width: 100%; top: 45%; position: relative;">
						Drag & Drop Media Here
					</h1>
				</div>

				<!-- Filter Section -->
				<span v-if="selected !== null && !playing">
					<div v-if="media.length === 2" style="position: absolute; bottom: 10px; left: 50%; z-index: 15;">
						<button @click="switchMedia(0, 1)" class="filter-button button-play black round-btn button-control">⇄</button>
					</div>
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
			    layout: [['0%', '50%', '33.33%'], ['0%', '50%', '33.33%']],
			    width: 1600,
			    height: 1200,
			    menu_opened: false,
			    media: this.media_prop,
			    medias: [],
			    wrappers: [],
			    slides: [],
			    selected: null,
			    grid: [
			      [{ startX: '0%', startY: '0%',   scale: 1, rotate: 0, z_index: 10 }],
			      [
			      	{ startX: '0%', startY: '0%',  scale: 0.5, rotate: 0, z_index: 10 },
			      	{ startX: '50%', startY: '0%', scale: 0.5, rotate: 0, z_index: 10 },
			      ],
				  [
				    { startX: '0%', startY: '0%',     scale: 0.33, rotate: 0, z_index: 10 },
				    { startX: '33.33%', startY: '0%', scale: 0.33, rotate: 0, z_index: 10 },
				    { startX: '66.66%', startY: '0%', scale: 0.33, rotate: 0, z_index: 10 },
				  ],
			      [
				    { startX: '0%', startY: '0%',     scale: 0.25, rotate: 0, z_index: 10 },
				    { startX: '50%', startY: '0%',    scale: 0.25, rotate: 0, z_index: 10 },
				    { startX: '0%', startY: '50%',    scale: 0.25, rotate: 0, z_index: 10 },
				    { startX: '50%', startY: '50%',   scale: 0.25, rotate: 0, z_index: 10 },
			      ],
			    ]
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
			    const mediaChanged = false;
			    for (let f of e.dataTransfer.files) {
				    /*
			        this.media[this.media.length] = {
					    path: f.path,
					    startX: '0%',
					    startY: '0%',
					    scale: 0.5,
				        z_index: 10,
					    rotate: 0,
				        selected: false
				    };
				    */
				    console.log(this.media.length);
				    if (this.media.length === 0) {
					    this.media[this.media.length] = {
						    path: f.path,
						    startX: '0%',
						    startY: '0%',
						    scale: 1,
						    translate: [0,0],
						    z_index: 10,
						    rotate: 0,
						    selected: false
					    };
				    } else if (this.media.length === 1){
					    this.media[0] = {
						    ...this.media[0],
						    startX: !mediaChanged ? '0%' : this.media[0].startX,
						    startY: !mediaChanged ? '25%' : this.media[0].startY,
						    scale: !mediaChanged ? 0.5 : this.media[0].scale,
						    z_index: !mediaChanged ? 10 : this.media[0].z_index,
						    rotate: !mediaChanged ? 0 : this.media[0].rotate,
					        translate: [-50,-50],
						    selected: false
					    };
					    this.media[this.media.length] = {
						    path: f.path,
						    startX: '50%',
						    startY: '25%',
						    scale: 0.5,
						    z_index: 10,
						    rotate: 0,
					        translate: [-50,-50],
						    selected: false
					    };
				    } else if (this.media.length === 2){
					    this.media[0] = {
						    ...this.media[0],
						    startX: !mediaChanged ? '0%' : this.media[0].startX,
						    startY: !mediaChanged ? '0%' : this.media[0].startY,
						    scale: !mediaChanged ? 0.33 : this.media[0].scale,
						    z_index: !mediaChanged ? 10 : this.media[0].z_index,
						    rotate: !mediaChanged ? 0 : this.media[0].rotate,
						    selected: false
					    };
					    this.media[1] = {
						    ...this.media[1],
						    startX: !mediaChanged ? '33.33%' : this.media[1].startX,
						    startY: !mediaChanged ? '0%' : this.media[1].startY,
						    scale: !mediaChanged  ? 0.33 : this.media[1].scale,
						    z_index: !mediaChanged ? 10 : this.media[1].z_index,
						    rotate: !mediaChanged ? 0 : this.media[1].rotate,
						    selected: false
					    };
					    this.media[this.media.length] = {
						    path: f.path,
						    startX: '66.66%',
						    startY: '0%',
						    scale: 0.33,
						    z_index: 10,
						    rotate: 0,
						    selected: false
					    };
				    } else if (this.media.length === 3){
					    this.media[0] = {
						    ...this.media[0],
						    startX: !mediaChanged ? '0%' : this.media[0].startX,
						    startY: !mediaChanged ? '0%' : this.media[0].startY,
						    scale: !mediaChanged ? 0.5 : this.media[0].scale,
						    z_index: !mediaChanged ? 10 : this.media[0].z_index,
						    rotate: !mediaChanged ? 0 : this.media[0].rotate,
						    selected: false
					    };
					    this.media[1] = {
						    ...this.media[1],
						    startX: !mediaChanged ? '50%' : this.media[1].startX,
						    startY: !mediaChanged ? '0%' : this.media[1].startY,
						    scale: !mediaChanged  ? 0.5 : this.media[1].scale,
						    z_index: !mediaChanged ? 10 : this.media[1].z_index,
						    rotate: !mediaChanged ? 0 : this.media[1].rotate,
						    selected: false
					    };
					    this.media[2] = {
						    ...this.media[1],
						    startX: !mediaChanged ? '0%' : this.media[1].startX,
						    startY: !mediaChanged ? '50%' : this.media[1].startY,
						    scale: !mediaChanged  ? 0.5 : this.media[1].scale,
						    z_index: !mediaChanged ? 10 : this.media[1].z_index,
						    rotate: !mediaChanged ? 0 : this.media[1].rotate,
						    selected: false
					    };
					    this.media[this.media.length] = {
						    path: f.path,
						    startX: '50%',
						    startY: '50%',
						    scale: 0.5,
						    z_index: 10,
						    rotate: 0,
						    selected: false
					    };
				    }

				    this.$forceUpdate();
				    this.$nextTick(this.init);
			        this.$forceUpdate();
			    }
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
		    switchMedia(indexFirst, indexSecond) {
		        let help = {...this.media[indexSecond], path: this.media[indexFirst].path};
			    this.media[indexFirst] = {...this.media[indexFirst], path: this.media[indexSecond].path};
			    this.media[indexSecond] = {...help};
			    this.$forceUpdate();
			    this.$nextTick(this.init);
		    },
		    rotate(index) {
		    	this.media[index].rotate += 90;
		    	this.$forceUpdate();
		    },
	        scale (index, factor) {
	            this.media[index].scale += factor;
	            this.$forceUpdate();
	        },
		    menu_open(e) {
			    this.menu_opened = !this.menu_opened;
			    this.$refs.menu.style.left = e.x + 'px';
			    this.$refs.menu.style.top = e.y + 'px';
		    },
		    reset (index, removePhoto = false) {
		    	console.log('RESET ' + index + ' R ' + removePhoto);
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
		    	console.log('MEDIA', this.media, "SLIDES", this.slides);
			    // If next slide exist
			    if (this.activeSlide + 1 < this.slides.length && this.slides.length > 0) {
					console.log('NEXT EXISTS');
				    // Save current slide modification
				    let slide = [];
				    for (let i = 0, size = this.media.length; i < size; i++) {
					    slide.push(this.media[0].path, this.media[0].startX, this.media[0].startY, this.media[0].scale, this.media[0].rotate);
					    this.reset(0, true);
				    }
				    if (slide.length > 0) this.slides[this.activeSlide] = slide;

				    for (let i = 0; i < this.slides[this.activeSlide + 1].length / 5; i++) {
					    this.media[i] = {
						    path: this.slides[this.activeSlide + 1][(5 * i)],
					    }
				    }

				    // Apply next one
				    this.$nextTick(() => {
					    this.init();

					    for (let i = 0; i < this.slides[this.activeSlide].length / 5; i++) {
					    	if (this.slides[this.activeSlide][(5 * i)])
						        this.media[i] = {
						            ...this.media[i],
					    		    // path: this.slides[this.activeSlide][(5 * i)],
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
				    if (this.media.length === 0 && (this.activeSlide === this.slides.length && this.slides.length > 0) ||
				       (this.media.length === 0 && this.slides.length === 0)) return false;

				    console.log('NEXT EMPTY', this.media, this.slides);
				    // Save current slide modification
				    let slide = [];
				    for (let i = 0, size = this.media.length; i < size; i++) {
					    slide.push(this.media[0].path, this.media[0].startX, this.media[0].startY, this.media[0].scale, this.media[0].rotate);
				        this.reset(0, true);
				    }
				    if (slide.length > 0) this.slides[this.activeSlide] = slide;
			    }
		        console.log('MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);
		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },
		    previousSlide () {
		        console.log('PR MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);
		        // If no slides prevent going back
			    if (this.slides.length === 0 || this.activeSlide === 0) return false;

		        if (this.media.length > 0) {
			        // Save current slide modification
			        let slide = [];
			        for (let i = 0, size = this.media.length; i < size; i++) {
				        slide.push(this.media[0].path, this.media[0].startX, this.media[0].startY, this.media[0].scale, this.media[0].rotate);
				        this.reset(0, true);
			        }
		            if (slide.length > 0) this.slides[this.activeSlide] = slide;
		        }

			    for (let i = 0; i < this.slides[this.activeSlide - 1].length / 5; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide - 1][(5 * i)],
				    }
			    }
		        console.log('BI MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);
		        this.$forceUpdate();
		        this.$nextTick(() => {
		        	this.init();

			        for (let i = 0; i < this.slides[this.activeSlide].length / 5; i++) {
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
		        console.log('MEDIA', this.media, "SLIDES", this.slides);

		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },


		    edit (presentation) {
			    presentation.slides.forEach(slide => {
				    let slideToAdd = [];
				    slide.forEach(media => {
				        slideToAdd.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    if (slideToAdd.length > 0) this.slides.push(slideToAdd);
			    });

			    console.log('EDIT', this.slides);

			    for (let i = 0; i < this.slides[this.activeSlide].length / 5; i++) {
			    	if (this.slides[this.activeSlide][(5 * i)])
					    this.media[i] = {
						    path: this.slides[this.activeSlide][(5 * i)],
					    }
			    }

			    this.$forceUpdate();

			    this.$nextTick(() => {
				    this.init();

				    for (let i = 0; i < this.slides[this.activeSlide].length / 5; i++) {
				    	if (this.media[i].path)
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
					    console.log('MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);

					    this.$emit('updateTotalSlides', this.slides.length);
		    },


			    play (presentation) {
				    presentation.slides.forEach(slide => {
					    let slideToAdd = [];
					    slide.forEach(media => {
						    slideToAdd.push(media.path, media.startX, media.startY, media.scale, media.rotate);
					    });
					    if (slideToAdd.length > 0) this.slides.push(slideToAdd);
				    });

				    for (let i = 0; i < this.slides[this.activeSlide].length / 5; i++) {
					    if (this.slides[this.activeSlide][(5 * i)])
						    this.media[i] = {
							    path: this.slides[this.activeSlide][(5 * i)],
						    }
				    }

				    this.$forceUpdate();

				    this.$nextTick(() => {
					    this.init();

					    for (let i = 0; i < this.slides[this.activeSlide].length / 5; i++) {
						    if (this.media[i].path)
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
			    if (this.media.length > 0) {
				    // Save current slide modification
				    let slide = [];
				    this.media.forEach((media, i) => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    this.slides[this.activeSlide] = slide;
			    }

			    // Column format
			    let maxMedias = 0;
			    this.slides.forEach(slide => {
			        if (slide.length / 5 > maxMedias) maxMedias = slide.length / 5;
			    });
			    for (let i = 0; i < maxMedias; i++) {
				    columnNames.push(
					    'path_' + (i + 1),
					    'startX_' + (i + 1),
					    'startY_'  + (i + 1),
					    'scale_'  + (i + 1),
					    'rotate_'  + (i + 1)
				    );
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
			adaptWrapper() {
				const windowRatio = window.innerWidth / window.innerHeight;
				console.log("windowRation " + windowRatio);
				if (windowRatio >= 1.77) {
					this.height = window.innerHeight;
					this.width = this.height * 1.33;
				} else {
					this.width = window.innerWidth;
					this.height = this.width / 1.33;
				}
				console.log(this.width, this.height);
				this.$forceUpdate()
			},
			init() {
		    	console.log('INIT', this.media)
			    // let container = this.playing ? document.querySelector('#' + this.id) : document;
			    let container = document;
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

				    // Default media props
			        console.log(this.medias[index]);
					this.media[index].ratio = this.medias[index].offsetWidth / this.medias[index].offsetHeight;
					console.log('RATION ' + this.media[index].ratio);
			    }
				this.adaptWrapper();
				window.addEventListener('resize', (e) => {
					this.adaptWrapper();
				});
			    this.$forceUpdate();
			},
	        compareMediaToGridPosition(grid, media) {
		    	console.log(grid, media);
		    	return grid.startX === media.startX &&
			        grid.startY === media.startY &&
	                grid.scale === media.scale &&
	                grid.z_index === media.z_index;
	        },
			isAnyMediaChanged() {
		        let result = false;
			    this.media.forEach((media, i) => {
			    	if (!result && i + 1 !== this.media.length &&
				      !this.compareMediaToGridPosition(this.grid[this.media.length - 1][i], media)
				    ) {
			    		result = true;
				    }
			    });
			    return result;
			},
			changeLayout(layout) {
			    this.layout = layout;
			},
			choose() {
				dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{ name: 'Image/Video', extensions: ['jpg', 'png', 'gif', 'mp4'] },
					]
				}, (files) => {
					if (files) {
						const mediaChanged = this.isAnyMediaChanged();
						console.log('mediaChanged: ' + mediaChanged);
						if (this.media.length === 0) {
							this.media[this.media.length] = {
								path: files[0],
								startX: '0%',
								startY: '0%',
								scale: 1,
								z_index: 10,
								rotate: 0,
								selected: false
							};
						} else if (this.media.length === 1){
							this.media[0] = {
							    ...this.media[0],
								startX: !mediaChanged ? '0%' : this.media[0].startX,
								startY: !mediaChanged ? '0%' : this.media[0].startY,
							    scale: !mediaChanged ? 0.5 : this.media[0].scale,
							    z_index: !mediaChanged ? 10 : this.media[0].z_index,
							    rotate: !mediaChanged ? 0 : this.media[0].rotate,
								selected: false
							};
							this.media[this.media.length] = {
								path: files[0],
								startX: '50%',
								startY: '0%',
								scale: 0.5,
								z_index: 10,
								rotate: 0,
								selected: false
							};
						} else if (this.media.length === 2){
							this.media[0] = {
							    ...this.media[0],
								startX: !mediaChanged ? '0%' : this.media[0].startX,
								startY: !mediaChanged ? '0%' : this.media[0].startY,
							    scale: !mediaChanged ? 0.33 : this.media[0].scale,
								z_index: !mediaChanged ? 10 : this.media[0].z_index,
								rotate: !mediaChanged ? 0 : this.media[0].rotate,
								selected: false
							};
							this.media[1] = {
							  ...this.media[1],
								startX: !mediaChanged ? '33.33%' : this.media[1].startX,
								startY: !mediaChanged ? '0%' : this.media[1].startY,
							    scale: !mediaChanged  ? 0.33 : this.media[1].scale,
								z_index: !mediaChanged ? 10 : this.media[1].z_index,
								rotate: !mediaChanged ? 0 : this.media[1].rotate,
								selected: false
							};
							this.media[this.media.length] = {
								path: files[0],
								startX: '66.66%',
								startY: '0%',
								scale: 0.33,
								z_index: 10,
								rotate: 0,
								selected: false
							};
						} else if (this.media.length === 3){
							this.media[0] = {
								...this.media[0],
								startX: !mediaChanged ? '0%' : this.media[0].startX,
								startY: !mediaChanged ? '0%' : this.media[0].startY,
								scale: !mediaChanged ? 0.5 : this.media[0].scale,
								z_index: !mediaChanged ? 10 : this.media[0].z_index,
								rotate: !mediaChanged ? 0 : this.media[0].rotate,
								selected: false
							};
							this.media[1] = {
								...this.media[1],
								startX: !mediaChanged ? '50%' : this.media[1].startX,
								startY: !mediaChanged ? '0%' : this.media[1].startY,
								scale: !mediaChanged  ? 0.5 : this.media[1].scale,
								z_index: !mediaChanged ? 10 : this.media[1].z_index,
								rotate: !mediaChanged ? 0 : this.media[1].rotate,
								selected: false
							};
							this.media[2] = {
								...this.media[2],
								startX: !mediaChanged ? '0%' : this.media[1].startX,
								startY: !mediaChanged ? '50%' : this.media[1].startY,
								scale: !mediaChanged  ? 0.5 : this.media[1].scale,
								z_index: !mediaChanged ? 10 : this.media[1].z_index,
								rotate: !mediaChanged ? 0 : this.media[1].rotate,
								selected: false
							};
							this.media[this.media.length] = {
								path: files[0],
								startX: '50%',
								startY: '50%',
								scale: 0.50,
								z_index: 10,
								rotate: 0,
								selected: false
							};
						}

					    this.$forceUpdate();
						this.$nextTick(this.init);
					}
				});
			},
	    }
	}

</script>

<style>
	.selecte {
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
