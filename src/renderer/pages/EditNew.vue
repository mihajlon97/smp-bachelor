<template>
	<div class="create page" style="padding-top: 0;">
		<span v-if="!$route.query.play">
			<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; width: 100%; color: white; text-align: center; z-index: 11; padding-top: 10px;">
			<button @click="$refs.editor.changeLayout([''])"  class="button button-play filter-button black round-btn">
				Layout 2x2
			</button>
			<button @click="$refs.editor.changeLayout(2)"  class="button button-play filter-button black round-btn">
				Layout 1:1:1
			</button>
			<button @click="$refs.editor.choose()"  class="button button-play filter-button black round-btn">
				Insert Media
			</button>
			<h3> {{ activeSlide + 1 }} </h3>
		</div>
		<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
			<button @click="save" class="button button-play black round-btn"> Save </button>
			<button @click="$router.push('/')"  class="button button-play black round-btn"> Cancel </button>
		</div>
		</span>

		<MediaHolder ref="editor" :playing="!!$route.query.play" :activeSlide="activeSlide" @updateTotalSlides="updateTotalSlides"/>
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
			const presentationToEdit = this.presentations.filter(presentation => presentation.id === this.$route.query.edit)[0];
		    this.$nextTick(() => {
		        this.$refs.editor.edit(presentationToEdit);
		    });
		  }

			// Play presentation
			if (this.$route.query.play !== undefined) {
				this.mode = 'play';
				const presentationToPlay = this.presentations.filter(presentation => presentation.id === this.$route.query.play)[0];
				this.$nextTick(() => {
					this.$refs.editor.play(presentationToPlay);
				});


				setTimeout(() => {
					if (this.$route.query.play) {
						document.onkeydown = (evt) => {
							evt = evt || window.event;
							let isEscape = false;
							if ("key" in evt) {
								isEscape = (evt.key === "Escape" || evt.key === "Esc");
							} else {
								isEscape = (evt.keyCode === 27);
							}
							if (isEscape) {
								require('electron').remote.getCurrentWindow().close();
							}
						};
					}

					// Click moving through presentation events
					let slider = document.getElementsByClassName('create')[0];

					slider.addEventListener('contextmenu', () => {
						console.log('RIGHT CLICK')
					    if (this.activeSlide > 0) this.previousSlide()
					});
					slider.addEventListener('click', () => {
					    console.log('LEFT CLICK')
						if (presentationToPlay.slides.length === this.activeSlide + 1) return;
					    this.nextSlide()
					})

				}, 1000);

			}
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
