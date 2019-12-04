<template>
	<div class="page" style="padding-top: 0;">
		<div style="position: absolute; right:65px; top: 5px;">
			<button @click="nextSlide" class="button button-play black round-btn">Next Slide</button>
		</div>
		<div style="position: absolute; right: 65px; bottom: 5px;">
			<button @click="save" class="button button-play black round-btn">Save</button>
			<button @click="cancel" class="button button-play black round-btn">Cancel</button>
		</div>

		<div style="margin-top: 0px;">
			<div style="height: 100vh; background-color: #b7b7b7; padding: 45px;">
				<img v-if="image1" class="image-create" style="" :src="get_blob(image1.path)">
				<div v-else class="image-create image-placeholder" style="text-align: center;">
					<img @click="create(1)" style="width: 97%;" src="../assets/image.jpg">
				</div>
				<img v-if="image2" class="image-create" style="" :src="get_blob(image2.path)">
				<div v-else class="image-create image-placeholder" style="text-align: center;">
					<img @click="create(2)" style="width: 97%;" src="../assets/image.jpg">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const { dialog } = require('electron').remote;
	import { mapActions } from 'vuex';
	export default {
	name: "Create",
	data(){
		return {
			image1: null,
			image2: null,
		    slides: []
		}
	},
    methods: {
        ...mapActions(['fetchPresentations']),
	    nextSlide () {
			this.slides.push({
				image1: this.image1,
				image2: this.image2
			});
	      this.image1 = null;
	      this.image2 = null;
	    },
	    cancel () {
        	this.$router.push('/');
	    },
		save () {
	    	const fs = require('fs');
			// Write to storage :D
			const storageDir = 'C:\\Users\\miki9\\Desktop\\Notebook\\Bachelor Informatik\\Semester 6\\Bachelor\\sip-bachelor\\src\\renderer\\storage\\';
			let rawStorage = fs.readFileSync(storageDir + 'storage.json');
			let presentations = JSON.parse(rawStorage);

			if (this.image1 || this.image2) {
				this.slides.push({
					image1: this.image1,
					image2: this.image2
				})
			}

			presentations.push({
			  id: this.uuidv4(),
			  name: 'Presentation ' + (presentations.length  + 1),
			  slides: this.slides
			});

		    fs.writeFileSync(storageDir + 'storage.json', JSON.stringify(presentations));
		    this.fetchPresentations();
		    this.$router.push('/');
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
		}
    }
}
</script>

<style scoped>
	.button{
		padding: 2px 12px;
	}
</style>
