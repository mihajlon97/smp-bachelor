<template>
	<div v-if="path.indexOf('.mp4') === -1" class="move" :style="`background-color: transparent;`">
		<img :src="get_blob(path)" style="height: 100%; width: 100%; object-fit: contain;" alt="">
	</div>
	<video v-else autoplay muted loop controls class="move" style="position:absolute; object-fit: contain;">
		<source :src="get_blob(path)" type="video/mp4">
	</video>
</template>

<script>
	export default {
		name: "Media",
	    data() {
			return {
				menu_opened: false,
			    z_index: 10 + this.index,
			}
	    },
	    props: {
		    selected: {
			    type: Boolean,
			    required: false,
			    default: false
		    },
	        index: {
	          type: Number,
	          required: true
	        },
			path: {
				type: String,
			    required: true,
			    default: ''
			}
	    },
		methods: {
		    menu_open() {
		        this.menu_opened = !this.menu_opened;
		    }
		}
	}
</script>

<style>

</style>
