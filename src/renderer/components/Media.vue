<template>
	<div class="move" ondragstart="return false;" @click="menu_opened = false" @contextmenu.prevent="menu_open">
		<!-- Context Menu -->
		<div v-show="menu_opened" class="context-menu" @click="menu_opened = false">
			<ul>
				<li @click="z_index = 9">Move to Back</li>
				<li @click="z_index = 10">Move to Middle</li>
				<li @click="z_index = 11">Move to Front</li>
				<li class="remove-option" @click="$emit('remove')"> Remove</li>
			</ul>
		</div>

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
	.context-menu {
		border-radius: 10px;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 400px!important;
	}

	.context-menu ul {
		border-radius: 10px;
		list-style-type: none;
		margin: 0;
		padding: 0;
		width: 400px!important;
		min-width: 400px!important;
		background-color: #f1f1f1;
	}

	.context-menu li {
		border-radius: 10px;
		display: block;
		color: #000;
		padding: 16px 32px;
		text-decoration: none;
		font-size: 40px;
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
