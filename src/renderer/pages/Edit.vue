<template>
	<div class="create page" style="padding-top: 0;">
		<!-- Navigation Controls -->
		<span>
			<!-- Previous & Next Slide Buttons -->
			<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
				<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
				<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
			</div>

			<!-- Layout Picker -->
			<LayoutPicker @changeLayout="changeLayout" />

			<!-- Save & Cancel Buttons -->
			<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
				<button @click="save" class="button button-play black round-btn"> Save </button>
				<button @click="cancel"  class="button button-play black round-btn"> Cancel </button>
			</div>
		</span>

		<!-- Media Editor Component -->
		<MediaHolder ref="editor" :activeSlide="activeSlide" @updateTotalSlides="updateTotalSlides"/>

		<!-- Active Slide Number -->
		<h3 id="slideNumber"> {{ activeSlide + 1 }} </h3>
	</div>
</template>

<script>
	import MediaHolder from '../components/MediaHolder';
	import { mapGetters, mapActions } from 'vuex';
	import LayoutPicker from "../components/LayoutPicker";
	export default {
		name: "Create",
		components: {
			LayoutPicker,
		    MediaHolder
		},
	    data() {
	      return {
	        hoverLayout: [1,1],
	        showLayout: false,
	        totalSlides: 0,
	        mode: 'create',
	      }
	    },
		async mounted() {
		  // Edit presentation
		  if (this.$route.query.edit !== undefined) {
			this.mode = 'edit';
			const presentationToEdit = this.presentations.filter(presentation => presentation.id === this.$route.query.edit)[0];
			this.$nextTick(() => {
		        this.$refs.editor.edit(presentationToEdit);
		    });
		  }
		},
		computed: {
			...mapGetters(['activeSlide', 'presentations'])
		},
		methods: {
		  ...mapActions(['fetchPresentations']),
		  changeLayout(data) {
		  	this.$refs.editor.changeLayout(data.rows, data.columns);
		  	this.showLayout = false;
		  },
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
		  cancel() {
			  this.fetchPresentations();
			  this.$router.push('/');
		  },
		  save() {
		  	if (this.mode === 'create') {
			  this.$refs.editor.save(this.$route.query.presentation_name);
			  this.fetchPresentations();
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
		padding: 10px 22px;
	}
</style>
