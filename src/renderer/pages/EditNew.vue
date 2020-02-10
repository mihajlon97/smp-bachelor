<template>
	<div class="create page" style="padding-top: 0;">
		<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; width: 100%; color: white; text-align: center; z-index: 11; padding-top: 10px;">
			<button @click="changeMediaCnt(-1)" class="filter-button black round-btn">－</button>
			<span style="font-size: 25px; margin: 0 10px;"> Medias </span>
			<button @click="changeMediaCnt(1)"  class="filter-button black round-btn">＋</button>
			<h3> {{ activeSlide + 1 }} </h3>
		</div>
		<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
			<button @click="save" class="button button-play black round-btn"> Save </button>
			<button @click="$router.push('/')"  class="button button-play black round-btn"> Cancel </button>
		</div>
		<MediaHolder ref="editor" :media_count="media_cnt" :activeSlide="activeSlide" @updateTotalSlides="updateTotalSlides"/>
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
	        media_cnt: this.$route.query.media_count,
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
		  this.media_cnt = this.$route.query.media_count || 2;
		},
		computed: {
			...mapState(['activeSlide', 'presentations'])
		},
		methods: {
		  ...mapActions(['fetchPresentations']),
		  changeMediaCnt(number) {
		  	if ((this.media_cnt === 1 && number < 0) || (this.media_cnt === 5 && number > 0 )) return;
		    this.media_cnt += number;
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

<style>
	.button{
		padding: 10px 22px;
	}
</style>
