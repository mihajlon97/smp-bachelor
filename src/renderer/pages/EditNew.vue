<template>
	<div class="create page" style="padding-top: 0;">
		<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
			<button @click="save" class="button button-play black round-btn"> Save </button>
			<button @click="$refs.editor.cancel()"  class="button button-play black round-btn"> Cancel </button>
		</div>
		<MediaHolder ref="editor"/>
	</div>
</template>

<script>
	import MediaHolder from '../components/MediaHolder';
	import { mapState, mapGetters, mapActions } from 'vuex';
	export default {
		name: "Create",
		components: { MediaHolder },
	    data() {
	      return {
	        totalSlides: 0,
	        mode: 'create',
	        loading: {
	        	rotate1: false,
	        	rotate2: false,
	        }
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

<style>
	.button{
		padding: 10px 22px;
	}
</style>
