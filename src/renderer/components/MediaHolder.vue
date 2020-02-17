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

		<div class="wrapper" :style="`width: ${width}px; height: ${height}px;`">
			<div v-for="i in rows" :key="i" :class="'row row-' + rows">
				<div v-for="j in columns" :key="j" :class="'column column-' + columns">
					<Media
							:style="`top:${media[((i-1)*columns)+j-1].startY}; left:${media[((i-1)*columns)+j-1].startX}; transform: scale(${media[((i-1)*columns)+j-1].scale}) rotate(${media[((i-1)*columns)+j-1].rotate}deg); z-index:${media[((i-1)*columns)+j-1].z_index};`"
							v-if="media[((i-1)*columns)+j-1] && media[((i-1)*columns)+j-1].path"
							:path="media[((i-1)*columns)+j-1].path"
							:index="((i-1)*columns)+j-1"
							@remove="reset(((i-1)*columns)+j-1, true)"
							@contextmenu.native.prevent="menu_open($event)"
							@click.native="menu_opened = false"
							ondragstart="return false;"
					/>

					<!-- Drag & Drop -->
					<div v-else class="chooseText">
						<h1 style="text-align: center; color: white; width: 100%; top: 45%; position: relative;">
							Drag & Drop Media Here
						</h1>
					</div>
				</div>
			</div>
		</div>

			<!-- Media width: ${width}px; height: ${height}px; -->
			<div v-if="false" class="wrapper" :style="`width: ${width}px; height: ${height}px;`">
				<Media v-for="i in media.length" :key="'media-' + i" :class="(( media[i - 1].selected && !playing) ? 'selected' : '')"
				       :style="`top:${media[i - 1].startY}; left:${media[i - 1].startX}; transform: scale(${media[i - 1].scale}) translate(${media[i - 1].translate[0]}%, ${media[i - 1].translate[1]}%) rotate(${media[i - 1].rotate}deg); z-index:${media[i - 1].z_index};`"
				       v-if="media[i - 1] && media[i - 1].path"
				       :path="media[i - 1].path"
				       :index="i"
				       @remove="reset(i - 1, true)"
				       @contextmenu.native.prevent="menu_open($event)"
				       @click.native="menu_opened = false"
				       ondragstart="return false;"
				/>

				<!-- Drag & Drop -->
				<div v-if="media.length === 0" @click="choose" class="chooseText">
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
			    rows: 2,
			    columns: 1,
			    layout: [['0%', '50%', '33.33%'], ['0%', '50%', '33.33%']],
			    width: 1600,
			    height: 1200,
			    menu_opened: false,
			    media: [],
			    medias: [],
			    wrappers: [],
			    slides: [],
			    selected: null,
			}
	    },
	    mounted() {
	        this.init();

		    let holders = [...document.querySelectorAll('.column')];

		    console.log(holders);

		    for (let i = 0; i < holders.length; i++) {
		    	let holder = holders[i];
				    holder.ondragover = () => { return false; };
				    holder.ondragleave = () => { return false; };
				    holder.ondragend = () => { return false; };

				    holder.ondrop = (e) => {
					    e.preventDefault();
					    for (let f of e.dataTransfer.files) {
						    this.media[i] = {
							    path: f.path,
							    startX: '0%',
							    startY: '0%',
							    scale: 1,
							    z_index: 10,
							    rotate: 0,
							    selected: false
						    };
						    this.$forceUpdate();
						    this.$nextTick(this.init);
						    this.$forceUpdate();
					    }
					    return false;
				    };
		    }
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
				    this.media[index] = {};
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
					    slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
					    this.reset(i, true);
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
					    slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
				        this.reset(i, true);
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
				        slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
				        this.reset(i, true);
			        }
		            if (slide.length > 0 && slide[0]) {
		            	this.slides[this.activeSlide] = slide;
		            }
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
				if (windowRatio >= 1.33) {
					this.height = window.innerHeight;
					this.width = this.height * 1.33;
				} else {
					this.width = window.innerWidth;
					this.height = this.width / 1.33;
				}
				this.$forceUpdate()
			},
			init() {
		    	console.log('INIT', this.media)
			    // let container = this.playing ? document.querySelector('#' + this.id) : document;
			    let container = document;
				this.wrappers = [...container.querySelectorAll('.column')];
			    this.medias = [...container.querySelectorAll('.move')];

			    for(let index = 0; index < this.media.length; index++) {
					let div = this.wrappers[index];

					if (this.medias.length === 0 || !div) return;

					if (this.medias[index]) {
						console.log(this.medias[index]);

						// Calculate x and y in %
						this.medias[index].style.left = !this.medias[index].style.left && this.media_prop[index] ? this.media_prop[index].startX : this.medias[index].style.left;
						this.medias[index].style.top = !this.medias[index].style.top &&  this.media_prop[index] ? this.media_prop[index].startY : this.medias[index].style.top;


						// Mousedown when mouse leave
						this.medias[index].addEventListener('mouseleave', (e) => {
							this.medias[index].mousedown = false;
						});

						this.medias[index].addEventListener('mousedown', (e) => {
							console.log(this.media);
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
				this.adaptWrapper();
				window.addEventListener('resize', (e) => {
					this.adaptWrapper();
				});
			    this.$forceUpdate();
			},
			changeLayout(rows, columns) {
			    this.rows = rows;
			    this.columns = columns;
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
							scale: 1,
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
