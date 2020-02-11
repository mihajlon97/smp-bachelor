<template>
	<div class="move" ondragstart="return false;">

		<!-- Image -->
		<img v-if="path.indexOf('.mp4') === -1" :src="get_blob(path)" style="margin: 0;" alt="">

		<!-- Video -->
		<video v-else-if="path.indexOf('.mp4') !== -1" autoplay muted loop  style="margin: 0;">
			<source :src="get_blob(path)" type="video/mp4">
		</video>

	</div>
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
