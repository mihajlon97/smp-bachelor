<template>
	<div style="margin-top: 0;">
		<div style="text-align: center; background-color: #b7b7b7;">
			<div :style="'width: 100%; max-width: 100%; height: 100vh; text-align: center; display: inline-block; ' + (!disabled ? 'padding: 0px;' : 'padding: 0px;')">
				<croppa v-model="myCroppa1"
				        :initial-image="path1 ? get_blob(path1) : ''"
				        auto-sizing
				        :canvas-color="'black'"
				        :placeholder-font-size="22"
				        :placeholder-color="'white'"
				        :accept="'image/*'"
				        :file-size-limit="0"
				        :quality="2"
				        :zoom-speed="1"
				        :disabled="disabled"
				        :disable-drag-and-drop="false"
				        :disable-click-to-choose="false"
				        :disable-drag-to-move="false"
				        :disable-scroll-to-zoom="false"
				        :disable-rotation="false"
				        :prevent-white-space="false"
				        :reverse-scroll-to-zoom="false"
				        :show-remove-button="!disabled"
				        :remove-button-color="'red'"
				        :remove-button-size="0"
				        initial-size="contain"
				        :metadata="meta1"
				>
				</croppa>

				<croppa v-model="myCroppa2"
				        :initial-image="path2 ? get_blob(path2) : ''"
				        auto-sizing
				        :canvas-color="'black'"
				        :placeholder-font-size="22"
				        :placeholder-color="'white'"
				        :accept="'image/*'"
				        :file-size-limit="0"
				        :quality="2"
				        :zoom-speed="1"
				        :disabled="disabled"
				        :disable-drag-and-drop="false"
				        :disable-click-to-choose="false"
				        :disable-drag-to-move="false"
				        :disable-scroll-to-zoom="false"
				        :disable-rotation="false"
				        :prevent-white-space="false"
				        :reverse-scroll-to-zoom="false"
				        :show-remove-button="!disabled"
				        :remove-button-color="'red'"
				        :remove-button-size="0"
				        initial-size="contain"
				        :metadata="meta2"
				>
				</croppa>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';

	export default {
	name: "Editor",
    data() {
		return {
			myCroppa1: {},
			myCroppa2: {},
		    path1: this.path1_prop,
		    path2: this.path2_prop,
		    meta1: this.meta1_prop,
		    meta2: this.meta2_prop,
			slides: [],
		}
    },
	props: {
		meta1_prop: {
			type: Object,
			required: false,
		    default: null
		},
		meta2_prop: {
			type: Object,
			required: false,
		    default: null
		},
		path1_prop: {
			type: String,
			required: false
		},
		path2_prop: {
			type: String,
			required: false
		},
	    disabled: {
	        type: Boolean,
	        default: false,
	        required: true
	    },
	},
	computed: {
	  ...mapState(['activeSlide'])
	},
	methods: {
		rotate (croppaNumber) {
		    console.log(this.myCroppa1.getMetadata());
		    this['myCroppa' + croppaNumber].rotate()
		    console.log(this.myCroppa1.getMetadata());
		},
		flip (croppaNumber, axis) {
		    console.log(this.myCroppa1.getMetadata());
		    console.log('FLIP :' + croppaNumber + " AXIS: " + axis);
			if (axis === 'x') this['myCroppa' + croppaNumber].flipX();
			else if (axis === 'y') this['myCroppa' + croppaNumber].flipY();
			console.log(this.myCroppa1.getMetadata());
		},
		edit (presentation) {
			presentation.slides.forEach(slide => {
			    this.slides.push([
					// Slide 1
			    	slide.image1.path, slide.image1.meta.startX, slide.image1.meta.startY, slide.image1.meta.scale, slide.image1.meta.orientation,
			        // Slide 2
			        slide.image2.path, slide.image2.meta.startX, slide.image2.meta.startY, slide.image2.meta.scale, slide.image2.meta.orientation,
			    ]);
			});

			// Slide 1
			this.path1 = this.slides[this.activeSlide][0];
			this.meta1 = {
				startX: this.slides[this.activeSlide][1],
				startY: this.slides[this.activeSlide][2],
				scale:  this.slides[this.activeSlide][3],
				orientation: this.slides[this.activeSlide][4],
			};

			// Slide 2
			this.path2 = this.slides[this.activeSlide][5];
			this.meta2 = {
				startX: this.slides[this.activeSlide][6],
				startY: this.slides[this.activeSlide][7],
				scale:  this.slides[this.activeSlide][8],
				orientation: this.slides[this.activeSlide][9],
			};

			console.log(this.meta1, this.meta2);
		},
	    previousSlide () {
	        // If no slides prevent going back
	        if (this.slides.length === 0 || this.activeSlide === 0) return false;

	        // Slide 1
	        this.path1 = this.slides[this.activeSlide - 1][0];
	        this.meta1 = {
	        	startX: this.slides[this.activeSlide - 1][1],
	            startY: this.slides[this.activeSlide - 1][2],
	            scale:  this.slides[this.activeSlide - 1][3],
	            orientation: this.slides[this.activeSlide - 1][4]
	        };

	        // Slide 2
		    this.path2 = this.slides[this.activeSlide - 1][5];
		    this.meta2 = {
			    startX: this.slides[this.activeSlide - 1][6],
			    startY: this.slides[this.activeSlide - 1][7],
			    scale:  this.slides[this.activeSlide - 1][8],
			    orientation: this.slides[this.activeSlide - 1][9]
		    };

		    let o1 = this.myCroppa1.getChosenFile();
		    let o2 = this.myCroppa2.getChosenFile();
		    const meta1 = this.myCroppa1.getMetadata();
		    const meta2 = this.myCroppa2.getMetadata();

	        if(this.activeSlide === this.slides.length && (o1 || o2)) {
	        	// Save new slide
		        this.slides.push([
			        o1.path, meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
			        o2.path, meta2.startX, meta2.startY, meta2.scale, meta2.orientation
		        ]);
	        } else if(this.slides[this.activeSlide]) {
	        	// Modify current slide if exist
	            this.slides[this.activeSlide] = [
	                this.slides[this.activeSlide][0], meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
	                this.slides[this.activeSlide][5], meta2.startX, meta2.startY, meta2.scale, meta2.orientation
	            ];
	        }

	        return this.refresh();
	    },
		refresh () {
			this.myCroppa1.refresh();
			this.myCroppa2.refresh();
			this.$emit('updateTotalSlides', this.slides.length);
			return true;
		},
		nextSlide () {
			let o1 = this.myCroppa1.getChosenFile();
			let o2 = this.myCroppa2.getChosenFile();
			const meta1 = this.myCroppa1.getMetadata();
			const meta2 = this.myCroppa2.getMetadata();

			// If next slide exist
			if (this.activeSlide + 1 < this.slides.length && this.slides.length > 0) {
				// Slide 1
				this.path1 = this.slides[this.activeSlide + 1][0];
				this.meta1 = {
					startX: this.slides[this.activeSlide + 1][1],
					startY: this.slides[this.activeSlide + 1][2],
					scale:  this.slides[this.activeSlide + 1][3],
					orientation: this.slides[this.activeSlide + 1][4]
				};

				// Slide 2
				this.path2 = this.slides[this.activeSlide + 1][5];
				this.meta2 = {
					startX: this.slides[this.activeSlide + 1][6],
					startY: this.slides[this.activeSlide + 1][7],
					scale:  this.slides[this.activeSlide + 1][8],
					orientation: this.slides[this.activeSlide + 1][9]
				};

				this.slides[this.activeSlide] = [
					this.slides[this.activeSlide][0], meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
					this.slides[this.activeSlide][5], meta2.startX, meta2.startY, meta2.scale, meta2.orientation
				];
			// If next slide is empty
			} else {
				// Prevent going on next slide if no images are picked and active slide is the last one
			    if (!o1 && !o2 && this.activeSlide === this.slides.length && this.slides.length > 0) return false;

			    // If one of images picked, insert slide at the end
			    if (o1 || o2) {
			      this.slides.push([
			      	o1.path, meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
			        o2.path, meta2.startX, meta2.startY, meta2.scale, meta2.orientation
			      ]);
			    } // Empty next slide
			    else {
				    this.slides[this.activeSlide] = [
					    this.slides[this.activeSlide][0], meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
					    this.slides[this.activeSlide][5], meta2.startX, meta2.startY, meta2.scale, meta2.orientation
				    ];
			        // Slide 1
					this.path1 = this.path1_prop;
					this.meta1 = this.meta1_prop;

					// Slide 2
					this.path2 = this.path2_prop;
					this.meta2 = this.meta2_prop;
				}
			}
		    return this.refresh();
		},
		cancel () {
			this.$router.push('/');
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

		    let o1 = this.myCroppa1.getChosenFile();
		    let o2 = this.myCroppa2.getChosenFile();

		    const meta1 = this.myCroppa1.getMetadata();
		    const meta2 = this.myCroppa2.getMetadata();

		    if (o1 || o2) {
		        this.slides.push([
		        	o1.path, meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
		            o2.path, meta2.startX, meta2.startY, meta2.scale, meta2.orientation
		        ]);
		    } else {
			    this.slides[this.activeSlide] = [
				    this.slides[this.activeSlide][0], meta1.startX, meta1.startY, meta1.scale, meta1.orientation,
				    this.slides[this.activeSlide][5], meta2.startX, meta2.startY, meta2.scale, meta2.orientation
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
		    this.$swal("Good job!", "Your presentation is ready!", "success").then(() => {
				location.reload();
			});
		}
	}
}
</script>

<style scoped>
</style>
