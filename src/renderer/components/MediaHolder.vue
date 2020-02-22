<template>
	<div class="wrapper-parent">
		<!-- Context Menu -->
		<div v-show="menu_opened && !playing" ref="menu" @click="menu_opened = false" class="context-menu">
			<ul>
				<li @click="rotate(selected)">Rotate</li>
				<li class="remove-option" @click="reset(selected, true)"> Remove</li>
			</ul>
		</div>

		<div class="wrapper" :style="`width: ${width}px; height: ${height}px;`">
			<div v-for="i in rows" :key="i" :class="'row row-' + rows">
				<div v-for="j in columns" :key="j" :class="'column column-' + columns">
					<transition name="fade">
						<Media
								:style="`top:${media[((i-1)*columns)+j-1].startY}; left:${media[((i-1)*columns)+j-1].startX}; transform: scale(${media[((i-1)*columns)+j-1].scale}) rotate(${media[((i-1)*columns)+j-1].rotate}deg);};`"
								v-if="media[((i-1)*columns)+j-1] && media[((i-1)*columns)+j-1].path"
								:path="media[((i-1)*columns)+j-1].path"
								:index="((i-1)*columns)+j-1"
								@remove="reset(((i-1)*columns)+j-1, true)"
								@contextmenu.native.prevent="menu_open($event)"
								@click.native="menu_opened = false"
								ondragstart="return false;"
						/>

						<!-- Drag & Drop -->
						<div v-else-if="!playing" class="chooseText" @click="choose(((i-1)*columns)+j)">
							<h1 style="text-align: center; color: white; width: 100%; top: 45%; position: relative;">
								Drag & Drop Media Here
							</h1>
						</div>
					</transition>
				</div>
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
			prop_rows: {
				type: Number,
				default: 1
			},
		    prop_columns: {
				type: Number,
				default: 2
			},
		    media_prop: {
		        type: Array,
		        default: () =>  []
		    }
		},
	    data() {
			return {
			    rows: this.prop_rows,
			    columns: this.prop_columns,
			    layout: [['0%', '50%', '33.33%'], ['0%', '50%', '33.33%']],
			    width: 1600,
			    height: 1200,
			    menu_opened: false,
			    media: this.media_prop.splice(2),
			    medias: [],
			    wrappers: [],
			    slides: [],
			    selected: null,
			}
	    },
	    mounted() {
			console.log("MOUNTED", this.media);
	        this.init();
	    },
		computed: {
			...mapState(['activeSlide'])
		},
	    methods: {
		    countChosenMedia () {
		    	let cnt = 0;
			    for (let i = 0; i < this.media.length; i++) {
				    if (this.isEmpty(this.media[i]) === false) cnt++;
			    }
			    return cnt;
		    },
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
		    	if (removePhoto) {
				    this.media[index] = {};
			    }
		    	else {
				    this.media[index] = {
					    path: this.media[index].path,
					    startX: '0%',
					    startY: '0%',
					    scale: 0.5,
					    rotate: 0,
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
				    let slide = [this.rows, this.columns];
				    for (let i = 0, size = this.media.length; i < size; i++) {
					    slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
					    this.reset(i, true);
				    }
				    if (slide.length > 0) this.slides[this.activeSlide] = slide;

				    for (let i = 0; i < (this.slides[this.activeSlide + 1].length - 2) / 5; i++) {
					    this.media[i] = {
						    path: this.slides[this.activeSlide + 1][(5 * i) + 2],
					    }
				    }

				    this.rows = this.slides[this.activeSlide + 1][0];
				    this.columns = this.slides[this.activeSlide + 1][1];

				    // Apply next one
				    this.$nextTick(() => {
					    this.init();

					    for (let i = 0; i < (this.slides[this.activeSlide].length - 2) / 5; i++) {
					    	if (this.slides[this.activeSlide][(5 * i) + 2])
						        this.media[i] = {
						            ...this.media[i],
					    		    // path: this.slides[this.activeSlide][(5 * i) + 2],
						            startX: this.slides[this.activeSlide][1 + 5 * i + 2],
						            startY: this.slides[this.activeSlide][2 + 5 * i + 2],
						            scale: this.slides[this.activeSlide][3 + 5 * i + 2],
						            rotate: this.slides[this.activeSlide][4 + 5 * i + 2],
							    }
					    }
				    });

				    // If next slide is empty
			    } else {

			        // Prevent going on next slide if and images are picked or active slide is the last one
				    if (this.media.length === 0 && (this.activeSlide === this.slides.length && this.slides.length > 0) ||
				       (this.media.length === 0 && this.slides.length === 0) || this.isEmpty(this.media[0]) || this.isEmpty(this.media[1])) return false;

				    console.log('NEXT EMPTY', this.media, this.slides);
				    // Save current slide modification
				    let slide = [this.rows, this.columns];
				    for (let i = 0, size = this.media.length; i < size; i++) {
					    slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
				        this.reset(i, true);
				    }
				    if (slide.length > 0) this.slides[this.activeSlide] = slide;

			        this.rows = this.slides[this.activeSlide][0];
			        this.columns = this.slides[this.activeSlide][1];

				    this.$forceUpdate();
			        this.$nextTick(this.init);
			    }

		        console.log('MEDIA', this.media, "SLIDES", this.slides, "A: " + this.activeSlide);
		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },
		    previousSlide () {
		        console.log('PR MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);
		        // If no slides prevent going back
			    if (this.slides.length === 0 || this.activeSlide === 0) return false;

		        let discard = false;
			    if(this.countChosenMedia() < this.rows * this.columns) {
			        discard = confirm("Discard changes for this slide?");
			    }

		        if (this.media.length > 0 && discard === false) {
			        // Save current slide modification
			        let slide = [this.rows, this.columns];
			        for (let i = 0, size = this.media.length; i < size; i++) {
				        slide.push(this.media[i].path, this.media[i].startX, this.media[i].startY, this.media[i].scale, this.media[i].rotate);
				        this.reset(i, true);
			        }
		            if (slide.length > 0 && slide[2]) {
		            	console.log('SLIDE');
		            	this.slides[this.activeSlide] = slide;
		            }
		        }

			    for (let i = 0; i < (this.slides[this.activeSlide - 1].length - 2) / 5; i++) {
				    this.media[i] = {
					    path: this.slides[this.activeSlide - 1][(5 * i) + 2],
				    }
			    }
		        console.log('BI MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);
		        this.$forceUpdate();
		        this.$nextTick(() => {
		        	this.init();

			        for (let i = 0; i < (this.slides[this.activeSlide].length - 2) / 5; i++) {
				        this.media[i] = {
				            ...this.media[i],
					        // path: this.slides[this.activeSlide][(5 * i) + 2],
					        startX: this.slides[this.activeSlide][1 + 5 * i + 2],
					        startY: this.slides[this.activeSlide][2 + 5 * i + 2],
					        scale: this.slides[this.activeSlide][3 + 5 * i + 2],
					        rotate: this.slides[this.activeSlide][4 + 5 * i + 2],
				        }
			        }
			        this.$forceUpdate();
		        });
				this.rows = this.slides[this.activeSlide - 1][0];
		        this.columns = this.slides[this.activeSlide - 1][1];
		        console.log('MEDIA', this.media, "SLIDES", this.slides, 'ACTIVE ' + this.activeSlide);

		        this.$emit('updateTotalSlides', this.slides.length);
		        return true;
		    },


		    edit (presentation) {
		    	console.log('EDIT', presentation);
			    presentation.slides.forEach(slide => {
				    let slideToAdd = [slide[0], slide[1]];
				    slide.shift();
				    slide.shift();
				    slide.forEach(media => {
				        slideToAdd.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    if (slideToAdd.length > 0) this.slides.push(slideToAdd);
			    });

			    for (let i = 0; i < (this.slides[this.activeSlide].length - 2) / 5; i++) {
			    	if (this.slides[this.activeSlide][(5 * i) + 2])
					    this.media[i] = {
						    path: this.slides[this.activeSlide][(5 * i) + 2],
					    }
			    }


		        this.rows = this.slides[this.activeSlide][0];
		        this.columns = this.slides[this.activeSlide][1];

			    this.$forceUpdate();

			    this.$nextTick(() => {
				    this.init();

				    for (let i = 0; i < (this.slides[this.activeSlide].length - 2) / 5; i++) {
				    	if (this.media[i].path)
						    this.media[i] = {
						        ...this.media[i],
							    // path: this.slides[this.activeSlide][(5 * i) + 2],
							    startX: this.slides[this.activeSlide][1 + 5 * i + 2],
							    startY: this.slides[this.activeSlide][2 + 5 * i + 2],
							    scale: this.slides[this.activeSlide][3 + 5 * i + 2],
							    rotate: this.slides[this.activeSlide][4 + 5 * i + 2],
						    }
				    }
			        this.$forceUpdate();
			    });
		        console.log('MEDIA', this.media, "SLIDES", this.slides, "A " + this.activeSlide);
		        this.$emit('updateTotalSlides', this.slides.length);
		    },
		    play (presentation) {
		    	console.log(presentation.slides);
			    presentation.slides.forEach(slide => {
				    let slideToAdd = [slide[0], slide[1]];
				    slide.shift();
				    slide.shift();
				    slide.forEach(media => {
					    slideToAdd.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    if (slideToAdd.length > 0) this.slides.push(slideToAdd);
			    });

			    for (let i = 0; i < (this.slides[this.activeSlide].length - 2) / 5; i++) {
				    if (this.slides[this.activeSlide][(5 * i) + 2])
					    this.media[i] = {
						    path: this.slides[this.activeSlide][(5 * i) + 2],
					    }
			    }

			    this.$forceUpdate();

			    this.$nextTick(() => {
				    this.init();

				    for (let i = 0; i < (this.slides[this.activeSlide].length - 2) / 5; i++) {
				    	console.log(this.media);
					    if (this.media[i].path)
						    this.media[i] = {
							    ...this.media[i],
							    // path: this.slides[this.activeSlide][(5 * i) + 2],
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

			    let columnNames = ['rows', 'columns'];
			    if (this.media.length > 0) {
				    // Save current slide modification
				    let slide = [this.rows, this.columns];
				    this.media.forEach((media, i) => {
					    slide.push(media.path, media.startX, media.startY, media.scale, media.rotate);
				    });
				    this.slides[this.activeSlide] = slide;
			    }

			    // Column format
			    let maxMedias = 0;
			    this.slides.forEach(slide => {
			        if (slide.length / 7 > maxMedias) maxMedias = slide.length / 7;
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
				if (windowRatio >= 1.77) {
					this.height = window.innerHeight;
					this.width = this.height * 1.77;
				} else {
					this.width = window.innerWidth;
					this.height = this.width / 1.77;
				}
				this.$forceUpdate()
			},
			init() {
		    	this.$forceUpdate();
			    // let container = this.playing ? document.querySelector('#' + this.id) : document;
			    let container = document;
				this.wrappers = [...container.querySelectorAll('.column')];
			    this.medias = [...container.querySelectorAll('.move')];

				// Drag & Drop
				let holders = [...document.querySelectorAll('.column')];
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
								rotate: 0,
							};
							this.$forceUpdate();
							this.$nextTick(this.init);
							this.$forceUpdate();
							if (this.countChosenMedia() < this.rows * this.columns) i++;
						}
						return false;
					};
				}


			    for(let index = 0; index < this.media.length; index++) {
					let div = this.wrappers[index];

					if (this.medias.length === 0 || !div) return;

					if (this.medias[index]) {
						// Calculate x and y in %
						this.medias[index].style.left = this.media[index] ? this.media[index].startX : this.medias[index].style.left;
						this.medias[index].style.top = this.media[index]  ? this.media[index].startY : this.medias[index].style.top;


						// Mousedown when mouse leave
						this.medias[index].addEventListener('mouseleave', (e) => {
							this.medias[index].mousedown = false;
						    this.medias[index].style.transition = 'all 1s';
						});

						this.medias[index].addEventListener('mousedown', (e) => {
						    this.medias[index].style.transition = 'transform 1s';

							// mouse state set to true
						    this.medias[index].mousedown = true;
						    this.selected = index;

						    // Subtract offset
							this.medias[index].dim_x = this.medias[index].offsetLeft - e.clientX;
							this.medias[index].dim_y = this.medias[index].offsetTop - e.clientY;

						    this.$forceUpdate();
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

			    // Adapt Screen Size
				this.adaptWrapper();
				window.addEventListener('resize', (e) => {
					this.adaptWrapper();
				});
			    this.$forceUpdate();
			},
			changeLayout(rows, columns) {
			    this.rows = rows;
			    this.columns = columns;
			    this.$nextTick(this.init);
			},
			choose(index = null) {
				dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{ name: 'Image/Video', extensions: ['jpg', 'png', 'gif', 'mp4'] },
					]
				}, (files) => {
					if (files) {
						this.media[index ? index - 1 : this.media.length] = {
							path: files[0],
							startX: '0%',
							startY: '0%',
							scale: 1,
							rotate: 0,
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
