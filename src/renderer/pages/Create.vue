<template>
	<div class="create page" style="padding-top: 0;">
		<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
			<button @click="save"    class="button button-play black round-btn"> Save      </button>
			<button @click="$refs.editor.cancel()"  class="button button-play black round-btn"> Cancel    </button>
		</div>
		<div style="position: absolute; bottom: 10px; text-align: center; width: 100%; z-index: 12;">
			<h3 style="color: white; text-align: center;"> {{ activeSlide }} </h3>
		</div>
		<Editor ref="editor" :disabled="false"/>
	</div>
</template>

<script>
	import Editor from '../components/Editor';
	import { mapGetters, mapActions } from 'vuex';
	export default {
		name: "Create",
		components: { Editor },
	    data() {
	      return {
	        activeSlide: 1
	      }
	    },
		async mounted() {
			await this.fetchPresentations();
		},
		methods: {
		  ...mapActions(['fetchPresentations']),
		  previousSlide() {
		    this.activeSlide += 1;
		    this.$refs.editor.previousSlide();
		  },
		  nextSlide() {
		  	this.$refs.editor.nextSlide();
		  	this.activeSlide += 1;
		  },
		  save() {
			this.$swal("Name your presentation", {
			  content: "input",
			  buttons: ["Save"],
			}).then((name) => {
				if (name && name.length > 0) {
					this.$refs.editor.save(name);
					this.fetchPresentations();
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
