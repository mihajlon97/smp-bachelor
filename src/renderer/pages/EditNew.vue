<template>
	<div class="create page" style="padding-top: 0;">
		<span v-if="!$route.query.play">
			<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; width: 100%; color: white; text-align: center; z-index: 11; padding-top: 10px;">
			<button @click="showLayout = !showLayout"
					class="button button-play filter-button black round-btn">
				Layout ˅
			</button>
			<button @click="$refs.editor.choose()"  class="button button-play filter-button black round-btn">
				Insert Media
			</button>

			<table v-if="showLayout">
				<tr>
					<td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 1 }"
					    @mouseover="hoverLayout = [1,1]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(1,1)">1x1</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 2 }"
					    @mouseover="hoverLayout = [1,2]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(1,2)">1x2</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 3 }"
					    @mouseover="hoverLayout = [1,3]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(1,3)">1x3</td>
				</tr>
				<tr>
					<td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 1 }"
					    @mouseover="hoverLayout = [2,1]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(2,1)">2x1</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 2 }"
					    @mouseover="hoverLayout = [2,2]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(2,2)">2x2</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 3 }"
					    @mouseover="hoverLayout = [2,3]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(2,3)">2x3</td>
				</tr>
				<tr>
					<td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 1 }"
					    @mouseover="hoverLayout = [3,1]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(3,1)">3x1</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 2 }"
					    @mouseover="hoverLayout = [3,2]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(3,2)">3x2</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 3 }"
					    @mouseover="hoverLayout = [3,3]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(3,3)">3x3</td>
				</tr>
			</table>

		</div>
		<div style="position: absolute; right:65px; top: 5px; z-index: 400;">
			<button @click="save" class="button button-play black round-btn"> Save </button>
			<button @click="$router.push('/')"  class="button button-play black round-btn"> Cancel </button>
		</div>
		</span>

		<MediaHolder ref="editor" :playing="!!$route.query.play" :activeSlide="activeSlide" @updateTotalSlides="updateTotalSlides"/>

		<h3 id="slideNumber"> {{ activeSlide + 1 }} </h3>
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
	        hoverLayout: [1,1],
	        showLayout: false,
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
		  changeLayout(rows, columns) {
		  	this.$refs.editor.changeLayout(rows, columns);
		  	this.showLayout = false;
		  },
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
	table {
		width: 200px;
		height: 200px;
		background-color: white;
		margin: 0 auto;
		border-radius: 20px;
	}

	table td {
		background-color: #dddddd;
		border-radius: 20px;
		font-size: 20px;
		color: black;
		cursor: pointer;
	}

	#slideNumber {
		text-align: center;
		width:100%;
		font-size: 20px;
		position: absolute;
		bottom: 20px;
		color: black;
	}
	.selectedLayout {
		box-shadow: 0 0 3px #ff932b;
		background-color: #bcbcbc;
	}
</style>
