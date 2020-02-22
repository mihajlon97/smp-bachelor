<template>
	<div class="create page" style="padding-top: 0;">
		<span>
			<div style="position: absolute; left:65px; top: 5px; z-index: 400;">
			<button v-show="activeSlide > 0" @click="previousSlide()" class="button button-play black round-btn"> Previous Slide </button>
			<button @click="nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; width: 100%; color: white; text-align: center; z-index: 11; padding-top: 10px;">
			<button @click="showLayout = !showLayout"
					class="button button-play filter-button black round-btn">
				Layout ˅
			</button>

			<table id="layoutTable" v-if="showLayout">
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
			<button @click="cancel"  class="button button-play black round-btn"> Cancel </button>
		</div>
		</span>

		<MediaHolder ref="editor" :activeSlide="activeSlide" @updateTotalSlides="updateTotalSlides"/>

		<h3 id="slideNumber"> {{ activeSlide + 1 }} </h3>
	</div>
</template>

<script>

	import MediaHolder from '../components/MediaHolder';
	import { mapGetters, mapActions } from 'vuex';
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
		},
		computed: {
			...mapGetters(['activeSlide', 'presentations'])
		},
		methods: {
		  ...mapActions(['fetchPresentations']),
		  changeLayout(rows, columns) {
		  	this.$refs.editor.changeLayout(rows, columns);
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
