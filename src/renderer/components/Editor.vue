<template>
	<div style="margin-top: 0;">
		<div style="text-align: center; background-color: #b7b7b7;">
			<div :style="'width: 100%; max-width: 100%; height: 100vh; text-align: center; display: inline-block; ' + (!disabled ? 'padding: 50px;' : 'padding: 0px;')">
				<croppa v-model="myCroppa1"
				        :initial-image="get_blob(path1)"
				        auto-sizing
				        :canvas-color="'black'"
				        :placeholder-font-size="22"
				        :placeholder-color="'black'"
				        :accept="'image/*'"
				        :file-size-limit="0"
				        :quality="2"
				        :zoom-speed="2"
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
				        @updateDone="$emit('updateDone')"
				>
					<img slot="placeholder" src="../../../static/image.jpg" />
				</croppa>

				<croppa v-model="myCroppa2"
				        :initial-image="get_blob(path2)"
				        auto-sizing
				        :canvas-color="'black'"
				        :placeholder-font-size="22"
				        :placeholder-color="'default'"
				        :accept="'image/*'"
				        :file-size-limit="0"
				        :quality="2"
				        :zoom-speed="2"
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
				        @updateDone="$emit('updateDone')"
				>
					<img slot="placeholder" src="../../../static/image.jpg" />
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
			required: true
		},
		path2: {
			type: String,
			required: true
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
			this.slides.push({
				image1: { file: { path: o1.path }, meta: {...this.myCroppa1.getMetadata() }},
				image2: { file: { path: o2.path }, meta: {...this.myCroppa2.getMetadata() }},
			});
			this.myCroppa1.refresh();
			this.myCroppa2.refresh();
		},
		cancel () {
			this.$router.push('/');
		},
		async save () {
			const fs = require('fs');
			// Write to storage :D
			const storageDir = 'C:\\Users\\miki9\\Desktop\\Notebook\\Bachelor Informatik\\Semester 6\\Bachelor\\sip-bachelor\\src\\renderer\\storage\\';
			let rawStorage = fs.readFileSync(storageDir + 'storage.json');
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
				id: this.uuidv4(),
				name: 'Presentation ' + (presentations.length  + 1),
				slides: this.slides
			});

			fs.writeFileSync(storageDir + 'storage.json', JSON.stringify(presentations));
			this.$swal("Good job!", "Your presentation is ready!", "success")
			this.$router.push('/');
		}
	},
    mounted () {
		setTimeout(() => {
			if (this.meta1) {
				let res = this.myCroppa1.applyMetadata(this.meta1);
				console.log(res);
			}
			if (this.meta2) {
				this.myCroppa2.applyMetadata(this.meta2);
			}
		}, 3000);
    }
}
</script>

<style scoped>

</style>
