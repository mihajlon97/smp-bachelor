<template>
	<div class="create page" style="padding-top: 0;">
		<div style="position: absolute; left:65px; top: 5px;">
			<button @click="$refs.editor.nextSlide()" class="button button-play black round-btn"> Next Slide </button>
		</div>
		<div style="position: absolute; right:65px; top: 5px;">
			<button @click="$refs.editor.save()"    class="button button-play black round-btn"> Save      </button>
			<button @click="$refs.editor.cancel()"  class="button button-play black round-btn"> Cancel    </button>
		</div>
		<div style="position: absolute; right: 65px; bottom: 5px;">
		</div>
		<Editor ref="editor"
		        :path1="presentations[0].slides[0]['image1'].file.path"
		        :path2="presentations[0].slides[0]['image2'].file.path"
		        :meta1="presentations[0].slides[0]['image1'].meta"
		        :meta2="presentations[0].slides[0]['image2'].meta"
		        :disabled="false"
		/>
	</div>
</template>

<script>
	import Editor from '../components/Editor';
	import { mapState, mapActions } from 'vuex';
	export default {
		name: "Create",
		components: { Editor },
		async mounted() {
			await this.fetchPresentations();
		},
		computed: {
		  ...mapState(['presentations'])
		},
		methods: {
		  ...mapActions(['fetchPresentations']),
		  leleLeba() {
		  	console.log('leleLeba')
		  }
		}
	}
</script>

<style scoped>
	.button{
		padding: 2px 12px;
	}

</style>
