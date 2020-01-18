<template>
	<div class="create page" style="padding-top: 0;">
		<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; left: 40%; z-index: 400;">
			<h3 style="color: white"> {{ firstLetterUppercase(mode) }} Presentation </h3>
		</div>
		<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
			<button @click="save" class="button button-play black round-btn"> Save </button>
			<button @click="$refs.editor.cancel()"  class="button button-play black round-btn"> Cancel </button>
		</div>
		<div style="position: absolute; bottom: 10px; text-align: center; width: 100%; z-index: 12;">
			<h3 style="color: white; text-align: center;"> {{ activeSlide + 1 }} </h3>
		</div>
		<Editor ref="editor" :disabled="false" :activeSlide="activeSlide" @updateTotalSlides="updateTotalSlides"/>
	</div>
</template>

<script>
	import Editor from '../components/Editor';
	import { mapState, mapGetters, mapActions } from 'vuex';
	export default {
		name: "Create",
		components: { Editor },
	    data() {
	      return {
	        totalSlides: 0,
	        mode: 'create'
	      }
	    },
		async mounted() {
		  // Edit presentation
		  if (this.$route.query.edit !== undefined) {
			this.mode = 'edit';
		    this.$refs.editor.edit(this.presentations.filter(presentation => presentation.id === this.$route.query.edit)[0]);
		  }
		},
		computed: {
			...mapState(['activeSlide', 'presentations'])
		},
		methods: {
		  ...mapActions(['fetchPresentations']),
		  updateTotalSlides(number) {
		  	this.totalSlides = number;
		  },
		  previousSlide() {
		  	if (this.totalSlides === 0 || this.activeSlide === 0) return;
		    if (this.$refs.editor.previousSlide()) {
			    this.$store.state.activeSlide -= 1;
		    }
		  },
		  nextSlide() {
		    if(this.$refs.editor.nextSlide() === true) {
		      this.$store.state.activeSlide += 1;
		    }
		  },
		  save() {
		  	if (this.mode === 'create') {
			  this.$swal("Name your presentation", {
				  content: "input",
				  buttons: ["Save"],
			  }).then((name) => {
				  if (name && name.length > 0) {
					  this.$refs.editor.save(name);
					  this.fetchPresentations();
				  }
			  });
		    } else if (this.mode === 'edit') {
		  	  const presentationToEdit = (this.presentations.filter(presentation => presentation.id === this.$route.query.edit)[0]);
			  this.$refs.editor.save(presentationToEdit.name, true, presentationToEdit.id);
			  this.fetchPresentations();
		    }
		  }
		}
	}
</script>

<style scoped>
	.button{
		padding: 2px 12px;
	}

</style>
