<template>
	<div class="move" ondragstart="return false;">

		<!-- Image -->
		<img v-if="path.indexOf('.mp4') === -1" :src="get_blob(path)" style="margin: 0;" alt="">

		<!-- Video -->
		<video v-else-if="path.indexOf('.mp4') !== -1" autoplay muted loop  style="margin: 0;">
			<source :src="get_blob(path)" type="video/mp4">
		</video>

		<!--
		<div v-if="media[i - 1] && media[i - 1].path && media[i - 1].path.indexOf('.mp4') === -1" class="move" :style="`background-size: contain; background-image: url('${get_blob(media[i - 1].path)};transform: scale(${media[i - 1].scale}) rotate(${media[i - 1].rotate}deg); top:${media[i - 1].startY}; left:${media[i - 1].startX};`"></div>
		<video v-else-if="media[i - 1] && media[i - 1].path && media[i - 1].path.indexOf('.mp4') !== -1" autoplay muted loop class="move" style="position:absolute; object-fit: contain;">
			<source :src="get_blob(media[i - 1].path)" type="video/mp4">
		</video>
		-->
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
