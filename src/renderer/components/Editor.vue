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
export default {
	name: "Editor",
    data() {
		return {
			myCroppa1: {},
			myCroppa2: {},
			image1: null,
			image2: null,
			slides: [],
		}
    },
	props: {
		meta1: {
			type: Object,
			required: false,
		    default: null
		},
		meta2: {
			type: Object,
			required: false,
		    default: null
		},
		path1: {
			type: String,
			required: false
		},
		path2: {
			type: String,
			required: false
		},
	    disabled: {
	      type: Boolean,
	      default: false,
	      required: true
	    }
	},
	methods: {
		nextSlide () {
			let o1 = this.myCroppa1.getChosenFile();
			let o2 = this.myCroppa2.getChosenFile();
		    const meta1 = this.myCroppa1.getMetadata();
			const meta2 = this.myCroppa2.getMetadata();

			/*
		    this.slides.push({
				image1: { file: { path: o1.path }, meta: {...this.myCroppa1.getMetadata() }},
				image2: { file: { path: o2.path }, meta: {...this.myCroppa2.getMetadata() }},
			});
			*/

		    this.slides.push([o1.path, meta1.startX, meta1.startY, meta1.scale, o2.path, meta2.startX, meta2.startY, meta2.scale]);
			this.myCroppa1.refresh();
			this.myCroppa2.refresh();
		},
		cancel () {
			this.$router.push('/');
		},
		async save (name) {
			const fs = require('fs');
			// Write to storage
		    const presentationId = this.uuidv4();
		    const excel = false;
		    if (excel) {
			    const storageDir =  require('path').join(__dirname, '\\..\\storage\\storage.json');
			    let rawStorage = fs.readFileSync(storageDir);
			    let presentations = JSON.parse(rawStorage);

			    if (this.myCroppa1.hasImage() || this.myCroppa2.hasImage()) {
				    let o1 = this.myCroppa1.getChosenFile();
				    let o2 = this.myCroppa2.getChosenFile();

				    this.slides.push({
					    image1: { file: { path: o1.path }, meta: {...this.myCroppa1.getMetadata()} },
					    image2: { file: { path: o2.path }, meta: {...this.myCroppa2.getMetadata()} },
				    });
			    }
			    presentations.push({
				    id: presentationId,
				    name: name,
				    slides: this.slides
			    });

			    fs.writeFileSync(storageDir, JSON.stringify(presentations));
		    } else {
			    const XLSX = require('xlsx');
			    const path = require('path');
			    const storageDir = path.join(__dirname, '\\..\\storage\\presentations.xlsx');
			    const presentationDir = path.join(__dirname, '\\..\\storage\\presentation-' + presentationId + '.xlsx');
			    const workbook = XLSX.readFile(path.join(storageDir));
			    const sheet_name_list = workbook.SheetNames;
			    const sheet = workbook.Sheets[sheet_name_list[0]];
			    const presentations = XLSX.utils.sheet_to_json(sheet);

			    if (this.myCroppa1.hasImage() || this.myCroppa2.hasImage()) {
				    let o1 = this.myCroppa1.getChosenFile();
				    let o2 = this.myCroppa2.getChosenFile();

				    const meta1 = this.myCroppa1.getMetadata();
				    const meta2 = this.myCroppa2.getMetadata();

			        this.slides.push([o1.path, meta1.startX, meta1.startY, meta1.scale, o2.path, meta2.startX, meta2.startY, meta2.scale]);
			        this.slides.unshift(['path_1', 'startX_1', 'startY_1',	'scale_1',	'path_2',	'startX_2',	'startY_2',	'scale_2']);

				    const book = XLSX.utils.book_new();
				    const sheet1 = XLSX.utils.aoa_to_sheet(this.slides);
				    XLSX.utils.book_append_sheet(book, sheet1, 'sheet1');

				    presentations.push({
					    id: presentationId,
					    name: name,
					    file: presentationDir
				    });

				    const sheet_updated = XLSX.utils.json_to_sheet(presentations);
				    workbook.Sheets[sheet_name_list[0]] = sheet_updated;
				    XLSX.writeFile(workbook, storageDir);
				    XLSX.writeFile(book, presentationDir);
			    }
		    }
			this.$swal("Good job!", "Your presentation is ready!", "success")
			this.$router.push('/');
		}
	}
}
</script>

<style scoped>

</style>
