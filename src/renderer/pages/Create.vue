<template>
	<div class="create page" style="padding-top: 0;">
		<div :style="'position: absolute; right:65px; top: 5px;  background-color: ' + bg ">
			<button @click="nextSlide" class="button button-play black round-btn">Next Slide {{lol}}</button>
		</div>
		<div style="position: absolute; right: 65px; bottom: 5px;">
			<input v-model="bg" placeholder="BG"/>
			<button @click="save" class="button button-play black round-btn">Save</button>
			<button @click="cancel" class="button button-play black round-btn">Cancel</button>
			<button @click="mrs" class="button button-play black round-btn">Transform</button>
		</div>

		<div style="margin-top: 0px;">
			<div style="text-align: center; background-color: #b7b7b7;">
				<div style="height: 100vh; padding: 45px; text-align: center; display: inline-block;">
					<croppa v-model="myCroppa1"
					        :initial-image="get_blob(presentations[3].slides[0]['image1'].file.path)"
					        auto-sizing
					        :canvas-color="'default'"
					        :placeholder-font-size="22"
					        :placeholder-color="'default'"
					        :accept="'image/*'"
					        :file-size-limit="0"
					        :quality="2"
					        :zoom-speed="9"
					        :disabled="false"
					        :disable-drag-and-drop="false"
					        :disable-click-to-choose="false"
					        :disable-drag-to-move="false"
					        :disable-scroll-to-zoom="false"
					        :disable-rotation="false"
					        :prevent-white-space="false"
					        :reverse-scroll-to-zoom="false"
					        :show-remove-button="true"
					        :remove-button-color="'red'"
					        :remove-button-size="0"
					        >
						<img slot="placeholder" src="../../../static/image.jpg" />
					</croppa>

					<croppa v-model="myCroppa2"
					        :initial-image="get_blob(presentations[3].slides[0]['image2'].file.path)"
					        auto-sizing
					        :canvas-color="'default'"
					        :placeholder-font-size="22"
					        :placeholder-color="'default'"
					        :accept="'image/*'"
					        :file-size-limit="0"
					        :quality="2"
					        :zoom-speed="9"
					        :disabled="false"
					        :disable-drag-and-drop="false"
					        :disable-click-to-choose="false"
					        :disable-drag-to-move="false"
					        :disable-scroll-to-zoom="false"
					        :disable-rotation="false"
					        :prevent-white-space="false"
					        :reverse-scroll-to-zoom="false"
					        :show-remove-button="true"
					        :remove-button-color="'red'"
					        :remove-button-size="0"
					>
						<img slot="placeholder" src="../../../static/image.jpg" />
					</croppa>

					<!--
					<img v-if="image1 && false" class="image-create" style="" :src="get_blob(image1.path)">
					<div v-else class="image-create image-placeholder" style="text-align: center;">
						<img @click="create(1)" style="width: 97%;" src="../assets/image.jpg">
					</div>
					<img v-if="image2" class="image-create" style="" :src="get_blob(image2.path)">
					<div v-else class="image-create image-placeholder" style="text-align: center;">
						<img @click="create(2)" style="width: 97%;" src="../assets/image.jpg">
					</div>
					-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const { dialog } = require('electron').remote;
	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	};
	import { mapActions, mapState } from 'vuex';
	export default {
	name: "Create",
	data(){
		return {
		    bg: 'red',
		    lol: false,
		    myCroppa1: {},
		    myCroppa2: {},
		    image1: null,
			image2: null,
		    slides: []
		}
	},
    computed: {
      ...mapState(['presentations'])
    },
    methods: {
        ...mapActions(['fetchPresentations']),
	    nextSlide () {
	        let o1 = this.myCroppa1.getChosenFile();
	        let o2 = this.myCroppa2.getChosenFile();
	        console.log(o1, o2);
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
		    this.fetchPresentations();
		    this.$swal("Good job!", "Your presentation is ready!", "success")
		    this.$router.push('/');
		},
		mrs () {
		  this.myCroppa1.applyMetadata(this.presentations[3].slides[0]['image1'].meta);
		  this.myCroppa2.applyMetadata(this.presentations[3].slides[0]['image2'].meta);
		},
		create (photoNumber) {
			let self = this;
			dialog.showOpenDialog({
			  properties: ['openFile'],
				filters: [
					{ name: 'Images', extensions: ['jpg', 'png', 'gif'] },
				]
			}, function (files) {
				if (files) {
					self['image' + photoNumber] = {
						path: files[0]
					};
				}
			});
		},
    },
	async mounted() {
		await this.fetchPresentations();

		setTimeout(() => {
			// console.log(this.myCroppa1.applyMetadata(this.presentations[1].slides[0]['image1'].meta));
		    // console.log(this.presentations[1].slides[0]['image1'].meta, this.presentations[1].slides[0]['image2'].meta)
		    // this.myCroppa1.applyMetadata(this.presentations[2].slides[0]['image1'].meta);
			// this.myCroppa2.applyMetadata(this.presentations[2].slides[0]['image2'].meta);
			this.$forceUpdate();
		    this.lol = true
		}, 300);
	},
	watch: {
		myCroppa1(nv) {
			console.log(nv);
		}
	}
}
</script>

<style scoped>
	.button{
		padding: 2px 12px;
	}

</style>
